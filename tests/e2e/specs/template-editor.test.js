/**
 * External dependencies
 */
const { test, expect } = require( '@playwright/test' );

/**
 * WordPress dependencies
 */
const { Admin, PageUtils } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'TemplateEditor', () => {
	let admin;

	test.beforeEach( async ( { page } ) => {
		const pageUtils = new PageUtils( { page } );
		admin = new Admin( { page, pageUtils } );
	} );

	test( 'creates a block with the template editor', async ( { page } ) => {
		const field = {
			label: 'Text',
			name: 'text',
			value: 'Here is an example value for this',
		};
		const blockName = 'Test Template Editor';
		const templateMarkup = `Here is the text field: {{${ field.name }}}`;

		await admin.visitAdminPage( 'post-new.php', 'post_type=genesis_custom_block' );
		await page.getByLabel( 'Block title' ).waitFor();
		await page.keyboard.type( blockName );

		await page.getByLabel( 'Add a new field' ).click();
		await page.getByLabel( 'Field Label' ).waitFor();
		await page.keyboard.type( field.label );

		await page.getByRole( 'button', { name: 'Template Editor', exact: true } ).click();
		await page.locator( '#gcb-template-editor' ).waitFor();
		await page.locator( '#gcb-template-editor' ).click();
		await page.keyboard.type( templateMarkup );

		await page.getByText( 'Editor Preview' ).click();
		await page.getByLabel( field.label ).fill( field.value );
		await page.getByRole( 'button', { name: /save draft/i } ).click();

		await page.getByText( 'Front-end Preview' ).click();
		await expect( page.getByText( `Here is the text field: ${ field.value }` ) ).toBeVisible();
	} );
} );
