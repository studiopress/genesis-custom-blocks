/**
 * External dependencies
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getDocument, queries } from 'pptr-testing-library';

/**
 * WordPress dependencies
 */
import {
	createNewPost,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

const uploadMediaFile = async ( $context, fieldLabel, fileName ) => {
	await ( await queries.findByLabelText( $context, fieldLabel ) ).click();
	const inputSelector = '.media-modal input[type=file]';
	await page.waitForSelector( inputSelector );
	const $input = await page.$( inputSelector );

	const testImagePath = path.join( __dirname, '..', 'assets', fileName );
	const newFileName = Math.floor( Math.random( 100000 ) * 100000 );
	const fileExtension = fileName.match( /.[^\.]+$/ )[ 0 ];
	const tmpFilePath = path.join( os.tmpdir(), `${ newFileName }${ fileExtension }` );
	fs.copyFileSync( testImagePath, tmpFilePath );

	await $input.uploadFile( tmpFilePath );
	const buttonSelector = '.media-button-select:not([disabled])';
	await page.waitForSelector( buttonSelector );
	await page.click( buttonSelector );

	return newFileName;
};

const insertBlock = async ( $context, blockName ) => {
	await ( await queries.findByLabelText( $context, /toggle block inserter/i ) ).click();
	await ( await queries.findByPlaceholderText( $context, /search/i ) ).type( blockName );
	await ( await queries.findByRole( $context, 'option', { name: blockName } ) ).click();
};

describe( 'AllFields', () => {
	it( 'creates the block and makes the fields available in the block editor', async () => {
		const { findAllByLabelText, findAllByText, findByLabelText, findByRole, findByText } = queries;
		const blockName = 'Testing Example';
		const fields = {
			text: {
				label: 'Testing Text',
				name: 'testing-text',
				value: 'This is some example text',
			},
			textarea: {
				label: 'Testing Textarea',
				name: 'testing-textarea',
				value: 'Lorem ipsum dolor sit amet',
			},
			url: {
				label: 'Testing URL',
				name: 'testing-url',
				value: 'https://example.com/baz',
			},
			email: {
				label: 'Testing Email',
				name: 'testing-email',
				value: 'jane.doe@example.com',
			},
			number: {
				label: 'Testing Number',
				name: 'testing-number',
				value: '3512344',
			},
			color: {
				label: 'Testing Color',
				name: 'testing-color',
				value: '#703232',
			},
			image: {
				label: 'Testing Image',
				name: 'testing-image',
			},
			file: {
				label: 'Testing File',
				name: 'testing-file',
			},
			inner_blocks: {
				label: 'Testing Inner Blocks',
				name: 'testing-inner-blocks',
			},
			select: {
				label: 'Testing Select',
				name: 'testing-select',
				value: 'bax',
				choices: `foo : Foo\nbax : Bax\n`,
			},
			multiselect: {
				label: 'Testing Multiselect',
				name: 'testing-multiselect',
				value: 'orange',
				choices: `apple : Apple \nbanana : Banana \norange : Orange`,
			},
			toggle: {
				label: 'Testing Toggle',
				name: 'testing-toggle',
				value: 'Yes',
			},
			range: {
				label: 'Testing Range',
				name: 'testing-range',
				value: '53',
			},
			checkbox: {
				label: 'Testing Checkbox',
				name: 'testing-checkbox',
				value: 'Yes',
			},
			radio: {
				label: 'Testing Radio',
				name: 'testing-radio',
				value: 'cabbage',
				choices: `celery : Celery \nlettuce : Lettuce \ncabbage : Cabbage`,
			},
		};

		// Create the custom block (a 'genesis_custom_block' post).
		const customPostType = 'genesis_custom_block';
		await visitAdminPage( 'post-new.php', `?post_type=${ customPostType }` );
		await ( await findByLabelText( await getDocument( page ), 'Block title' ) ).click();
		await page.keyboard.type( blockName );

		const $editBlockDocument = await getDocument( page );
		const addNewField = async ( fieldType ) => {
			await ( await findByRole( $editBlockDocument, 'button', { name: /add a new field/i } ) ).click();
			expect( await findByRole( $editBlockDocument, 'button', { name: /add a new field/i } ) ).toBeInTheDocument();
			await findByLabelText( $editBlockDocument, 'Field Label' );
			await page.keyboard.type( fields[ fieldType ].label );
			await page.select( '#field-control', fieldType );
			await ( await findByRole( $editBlockDocument, 'combobox', { name: /field type/i } ) )
				.select( fieldType );
		};

		await addNewField( 'text' );
		await addNewField( 'textarea' );
		await addNewField( 'url' );
		await addNewField( 'email' );
		await addNewField( 'number' );
		await addNewField( 'color' );
		await addNewField( 'image' );
		await addNewField( 'file' );
		await addNewField( 'inner_blocks' );
		await addNewField( 'select' );
		await ( await findByLabelText( $editBlockDocument, /choices/i ) ).type( fields.select.choices );
		await addNewField( 'multiselect' );
		await ( await findByLabelText( $editBlockDocument, /choices/i ) ).type( fields.multiselect.choices );
		await addNewField( 'toggle' );
		await addNewField( 'range' );
		await addNewField( 'checkbox' );
		await addNewField( 'radio' );
		await ( await findByLabelText( $editBlockDocument, /choices/i ) ).type( fields.radio.choices );

		await ( await findByText( $editBlockDocument, /publish/i ) ).click();
		await findByText( $editBlockDocument, /update/i );

		// Ensure there's no console error in the 'Editor Preview' display.
		await ( await findByText( $editBlockDocument, 'Editor Preview' ) ).click();

		// Create a new post and add the new block.
		await createNewPost();

		const $blockEditorDocument = await getDocument( page );
		await insertBlock( $blockEditorDocument, blockName );
		const typeIntoField = async ( fieldType ) => {
			const $field = await findByLabelText( $blockEditorDocument, fields[ fieldType ].label );
			await $field.type( fields[ fieldType ].value );
		};

		await typeIntoField( 'text' );
		await typeIntoField( 'textarea' );
		await typeIntoField( 'url' );
		await typeIntoField( 'email' );
		await typeIntoField( 'number' );
		await typeIntoField( 'color' );

		const imageFileName = await uploadMediaFile( $blockEditorDocument, fields.image.label, 'trombone.jpg' );
		const fileUploadName = await uploadMediaFile( $blockEditorDocument, fields.file.label, 'example.pdf' );

		await ( await findByLabelText( $blockEditorDocument, fields.select.label ) ).select( fields.select.value );
		await page.click( `[value=${ fields.multiselect.value }` );
		await ( await findByLabelText( $blockEditorDocument, fields.toggle.label ) ).click();
		await ( await findAllByLabelText( $blockEditorDocument, fields.range.label ) )[ 1 ].type( fields.range.value );
		await ( await findByLabelText( $blockEditorDocument, fields.checkbox.label ) ).click();
		await page.click( `[value=${ fields.radio.value }` );

		// Click away from the block so the <ServerSideRender> displays.
		await ( await findByRole( $blockEditorDocument, 'textbox', { name: /add title/i } ) ).click();

		const getExpectedText = ( templateFunction, fieldName ) => {
			return `Here is the result of calling ${ templateFunction } for ${ fields[ fieldName ].name }: ${ fields[ fieldName ].value }`;
		};
		const options = { exact: false };

		await findAllByText( $blockEditorDocument, fields.text.value, options );
		await findAllByText( $blockEditorDocument, fields.textarea.value, options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'url' ), options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'url' ), options );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'email' ), options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'email' ), options );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'number' ), options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'number' ), options );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'color' ), options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'color' ), options );

		await findByText( $blockEditorDocument, imageFileName, options );
		await findByText( $blockEditorDocument, fileUploadName, options );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'select' ), options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'select' ), options );

		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'multiselect' ), options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'toggle' ), options );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'range' ), options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'range' ), options );

		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'checkbox' ), options );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'radio' ), options );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'radio' ), options );
	} );
} );
