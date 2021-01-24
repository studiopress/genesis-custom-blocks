/**
 * External dependencies
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { getDocument, queries } from 'pptr-testing-library';

/**
 * WordPress dependencies
 */
import {
	clickButton,
	createNewPost,
	insertBlock,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

const customPostType = 'genesis_custom_block';

describe( 'AllFields', () => {
	it( 'creates the block and makes the fields available in the block editor', async () => {
		const { findAllByText, findByText, findAllByLabelText, findByLabelText } = queries;
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
				value: 'No',
			},
			range: {
				label: 'Testing Range',
				name: 'testing-range',
				value: '53',
			},
			checkbox: {
				label: 'Testing Checkbox',
				name: 'testing-checkbox',
				value: 'No',
			},
			radio: {
				label: 'Testing Radio',
				name: 'testing-radio',
				value: 'cabbage',
				choices: `celery : Celery \nlettuce : Lettuce \ncabbage : Cabbage`,
			},
		};

		// Create the custom block (a 'genesis_custom_block' post).
		await visitAdminPage( 'post-new.php', `?post_type=${ customPostType }` );
		await findByLabelText( await getDocument( page ), 'Block title' );
		await page.keyboard.type( blockName );

		const $editBlockDocument = await getDocument( page );
		const addNewField = async ( fieldType ) => {
			await ( await findByLabelText( $editBlockDocument, 'Add a new field' ) ).click();
			await findByLabelText( $editBlockDocument, 'Field Label' );
			await page.keyboard.type( fields[ fieldType ].label );
			await page.select( '#field-control', fieldType );
		};

		await addNewField( 'text' );
		await addNewField( 'textarea' );
		await addNewField( 'url' );
		await addNewField( 'email' );
		await addNewField( 'number' );
		await addNewField( 'color' );
		await addNewField( 'image' );
		await addNewField( 'toggle' );
		await addNewField( 'select' );
		await ( await findByLabelText( $editBlockDocument, /choices/i ) ).type( fields.select.choices );
		await addNewField( 'multiselect' );
		await ( await findByLabelText( $editBlockDocument, /choices/i ) ).type( fields.multiselect.choices );
		await addNewField( 'range' );
		await addNewField( 'checkbox' );
		await addNewField( 'radio' );
		await ( await findByLabelText( $editBlockDocument, /choices/i ) ).type( fields.radio.choices );

		( await findByText( $editBlockDocument, /publish/i ) ).click();
		await findByText( $editBlockDocument, /published/i );

		// Create a new post and add the new block.
		await createNewPost();
		await insertBlock( blockName );

		const $blockEditorDocument = await getDocument( page );
		const typeIntoField = async ( fieldType ) => {
			await ( await findByLabelText( $blockEditorDocument, fields[ fieldType ].label ) ).type( fields[ fieldType ].value );
		};

		await typeIntoField( 'text' );
		await typeIntoField( 'textarea' );
		await typeIntoField( 'url' );
		await typeIntoField( 'email' );
		await typeIntoField( 'number' );
		await typeIntoField( 'color' );

		await clickButton( 'Media Library' );
		const inputSelector = '.media-modal input[type=file]';
		await page.waitForSelector( inputSelector );
		const input = await page.$( inputSelector );

		const testImagePath = path.join( __dirname, '..', 'assets', 'trombone.jpg' );
		const imageFileName = uuid();
		const tmpFileName = path.join( os.tmpdir(), imageFileName + '.jpg' );
		fs.copyFileSync( testImagePath, tmpFileName );

		await input.uploadFile( tmpFileName );
		const buttonSelector = '.media-button-select:not([disabled])';
		await page.waitForSelector( buttonSelector );
		await page.click( buttonSelector );

		await ( await findByLabelText( $blockEditorDocument, fields.select.label ) ).select( fields.select.value );
		await page.click( `[value=${ fields.multiselect.value }` );
		await ( await findByLabelText( $blockEditorDocument, fields.toggle.label ) ).click();
		await ( await findAllByLabelText( $blockEditorDocument, fields.range.label ) )[ 1 ].type( fields.range.value );
		await ( await findByLabelText( $blockEditorDocument, fields.checkbox.label ) ).click();
		await page.click( `[value=${ fields.radio.value }` );

		// Click away from the block so the <ServerSideRender> displays.
		await page.click( '.editor-post-title__block' );

		const getExpectedText = ( templateFunction, fieldName ) => {
			return `Here is the result of calling ${ templateFunction } for ${ fields[ fieldName ].name }: ${ fields[ fieldName ].value }`;
		};

		// Ensure the PHP template renders the right values for each field.
		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'text' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'text' ) );

		await findAllByText( $blockEditorDocument, fields.textarea.value );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'url' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'url' ) );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'email' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'email' ) );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'number' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'number' ) );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'color' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'color' ) );

		await findByText( $blockEditorDocument, imageFileName, { exact: false } );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'select' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'select' ) );

		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'multiselect' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'toggle' ) );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'range' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'range' ) );

		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'checkbox' ) );

		await findByText( $blockEditorDocument, getExpectedText( 'block_value', 'radio' ) );
		await findByText( $blockEditorDocument, getExpectedText( 'block_field', 'radio' ) );
	} );
} );
