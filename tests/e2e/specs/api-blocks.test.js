/**
 * External dependencies
 */
const { test, expect } = require( '@playwright/test' );

/**
 * WordPress dependencies
 */
const { Admin, Editor, PageUtils } = require( '@wordpress/e2e-test-utils-playwright' );

/**
 * Internal dependencies
 */
const { getEditorCanvas } = require( '../helpers' );

test.describe( 'ApiBlocks', () => {
	let admin, editor;

	test.beforeEach( async ( { page } ) => {
		const pageUtils = new PageUtils( { page } );
		admin = new Admin( { page, pageUtils } );
		editor = new Editor( { page } );
		await admin.visitAdminPage( 'post-new.php' );
		await editor.setPreferences( 'core/edit-post', { welcomeGuide: false } );
	} );

	test( 'displays PHP-registered blocks', async ( { page } ) => {
		const canvas = await getEditorCanvas( page );

		const insertBlockByName = async ( blockName ) => {
			const inserterButton = page.getByRole( 'button', { name: 'Block Inserter', exact: true } );
			// Close the inserter if already open to get a stable starting state.
			if ( ( await inserterButton.getAttribute( 'aria-pressed' ) ) === 'true' ) {
				await inserterButton.click();
				await page.locator( '.block-editor-inserter__block-list' ).waitFor( { state: 'hidden' } );
			}
			await inserterButton.click();
			await page.locator( '.block-editor-inserter__block-list' ).waitFor();
			await page.getByRole( 'option', { name: new RegExp( blockName, 'i' ) } ).click();
		};

		await insertBlockByName( 'Test Url' );
		await expect( canvas.getByText( 'Test Url' ) ).toBeVisible();
		await expect( canvas.getByLabel( 'Url Here' ) ).toBeVisible();

		await insertBlockByName( 'Test Text' );
		await expect( canvas.getByText( 'Test Text' ) ).toBeVisible();
		await expect( canvas.getByLabel( 'Enter some text here' ) ).toBeVisible();
	} );
} );
