/**
 * External dependencies
 */
const { test, expect } = require( '@playwright/test' );

/**
 * WordPress dependencies
 */
const {
	Admin,
	Editor,
	PageUtils,
} = require( '@wordpress/e2e-test-utils-playwright' );

/**
 * Internal dependencies
 */
const { uploadMediaFile } = require( '../helpers' );

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

test.describe( 'AllFields', () => {
	let admin, editor;

	// Create the custom block once before any tests run. Playwright does not
	// re-run beforeAll on retries, so failed test retries skip straight to
	// inserting and interacting with the already-created block.
	test.beforeAll( async ( { browser } ) => {
		test.setTimeout( 300000 );

		const baseURL = process.env.WP_BASE_URL || 'http://localhost:8888';
		const context = await browser.newContext( {
			baseURL,
			storageState: 'tests/e2e/storage-states/admin.json',
		} );
		const page = await context.newPage();
		const pageUtils = new PageUtils( { page } );
		const setupAdmin = new Admin( { page, pageUtils } );

		await setupAdmin.visitAdminPage(
			'post-new.php',
			'post_type=genesis_custom_block'
		);
		await page.getByLabel( 'Block title' ).click();
		await page.keyboard.type( blockName );

		const addNewField = async ( fieldType ) => {
			await page.getByLabel( 'Add a new field' ).click();
			await page.getByLabel( 'Field Label' ).waitFor();
			await page.keyboard.type( fields[ fieldType ].label );
			await page
				.getByRole( 'combobox', { name: /field type/i } )
				.selectOption( fieldType );
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
		await page.getByLabel( /choices/i ).fill( fields.select.choices );
		await addNewField( 'multiselect' );
		await page.getByLabel( /choices/i ).fill( fields.multiselect.choices );
		await addNewField( 'toggle' );
		await addNewField( 'range' );
		await addNewField( 'checkbox' );
		await addNewField( 'radio' );
		await page.getByLabel( /choices/i ).fill( fields.radio.choices );

		await page.getByText( /publish/i ).click();
		await page.getByText( /save/i ).waitFor();

		// Ensure there's no console error in the 'Editor Preview' display.
		await page.getByText( 'Editor Preview' ).click();

		await context.close();
	} );

	test.beforeEach( async ( { page } ) => {
		const pageUtils = new PageUtils( { page } );
		admin = new Admin( { page, pageUtils } );
		editor = new Editor( { page } );
	} );

	test( 'makes the fields available in the block editor', async ( { page } ) => {
		test.setTimeout( 300000 );

		await admin.visitAdminPage( 'post-new.php' );
		await editor.setPreferences( 'core/edit-post', { welcomeGuide: false } );

		const frame = page.frameLocator( 'iframe[name="editor-canvas"]' );

		// Insert the block.
		await page.getByRole( 'button', { name: 'Block Inserter' } ).click();
		await page.getByRole( 'option', { name: 'Testing Example' } ).click();
		await page.getByRole( 'button', { name: 'Close Block Inserter' } ).click();

		// Wait for block fields to appear.
		await frame
			.getByRole( 'textbox', { name: fields.text.label, exact: true } )
			.waitFor();

		// Fill fields.
		await frame
			.getByRole( 'textbox', { name: fields.text.label, exact: true } )
			.fill( fields.text.value );
		await frame
			.getByRole( 'textbox', { name: fields.textarea.label } )
			.fill( fields.textarea.value );
		await frame
			.getByRole( 'textbox', { name: fields.url.label } )
			.fill( fields.url.value );
		await frame
			.getByRole( 'textbox', { name: fields.email.label } )
			.fill( fields.email.value );
		await frame
			.getByRole( 'spinbutton', { name: fields.number.label } )
			.fill( fields.number.value );
		await frame
			.getByRole( 'textbox', { name: fields.color.label } )
			.fill( fields.color.value );
		await frame
			.getByRole( 'textbox', { name: fields.color.label } )
			.press( 'Tab' );

		const imageFileName = await uploadMediaFile(
			page,
			frame,
			fields.image.label,
			'trombone.jpg'
		);

		const fileUploadName = await uploadMediaFile(
			page,
			frame,
			fields.file.label,
			'example.pdf'
		);

		await frame.getByLabel( fields.select.label, { exact: true } ).selectOption( fields.select.value );
		await frame.getByLabel( /Multiselect/ ).selectOption( fields.multiselect.value );
		await frame.getByRole( 'checkbox', { name: fields.toggle.label, exact: true } ).check();
		await frame.getByLabel( fields.range.label, { exact: true } ).nth( 1 ).fill( fields.range.value );
		await frame.getByRole( 'checkbox', { name: fields.checkbox.label, exact: true } ).check();
		await frame.getByRole( 'radio', { name: 'Cabbage' } ).check();

		// Click the title to trigger the server-side render preview.
		await frame.getByRole( 'textbox', { name: /add title/i } ).click();

		const getExpectedText = ( templateFunction, fieldName ) => {
			return `calling ${ templateFunction } for ${ fields[ fieldName ].name }: ${ fields[ fieldName ].value }`;
		};

		await expect( frame.getByText( fields.text.value ).first() ).toBeVisible();
		await expect( frame.getByText( fields.textarea.value ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_value', 'url' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'url' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_value', 'email' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'email' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_value', 'number' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'number' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_value', 'color' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'color' ) ).first() ).toBeVisible();
		await expect( frame.getByText( String( imageFileName ) ).first() ).toBeVisible();
		await expect( frame.getByText( String( fileUploadName ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_value', 'select' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'select' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'multiselect' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'toggle' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_value', 'range' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'range' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'checkbox' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_value', 'radio' ) ).first() ).toBeVisible();
		await expect( frame.getByText( getExpectedText( 'block_field', 'radio' ) ).first() ).toBeVisible();
	} );
} );
