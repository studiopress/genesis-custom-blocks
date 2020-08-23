/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

const customPostType = 'genesis_custom_block';

describe( 'TextBlock', () => {
	it( 'creates the block and makes it available in the block editor', async () => {
		const blockName = 'Testing Example';
		const fieldName = 'Testing Text';

		// Create the custom block (a 'genesis_custom_block' post).
		await visitAdminPage( 'post-new.php', `?post_type=${ customPostType }` );
		await page.click( '[name="post_title"]' );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.type( blockName );

		// Add a Text field.
		await page.click( '#block-add-field' );
		await page.click( '.block-fields-edit-label input' );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.type( fieldName );

		// Publish the block.
		await page.click( '#publish' );

		// Create a new post and add the new block.
		await createNewPost();
		await insertBlock( blockName );
		await page.waitForSelector( '.wp-block' );

		const fieldValue = 'this is some example text';
		const fieldSelector = '.components-base-control__field';

		// The block should have the Text field.
		expect( await page.evaluate( () => document.querySelector( '.components-base-control__label' ).textContent ) ).toContain( fieldName );

		// Type into the text field.
		await page.click( `${ fieldSelector } input` );
		await page.keyboard.type( fieldValue );

		// Click away from the block so the <ServerSideRender> displays.
		await page.click( '.editor-post-title__block' );
		await page.waitForSelector( '.genesis-custom-blocks-editor__ssr p' );

		// The <ServerSideRender> should display the content from the block template in the plugin, and should show the text field value.
		const ssrText = await page.evaluate( () => document.querySelector( '.genesis-custom-blocks-editor__ssr p' ).innerText );
		expect( ssrText ).toContain( `Here is the result of calling block_value with the field name: ${ fieldValue }` );
		expect( ssrText ).toContain( `Here is the result of calling block_field with the field name: ${ fieldValue }` );
	} );
} );
