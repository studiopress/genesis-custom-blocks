/**
 * External dependencies
 */
import { getDocument, queries } from 'pptr-testing-library'

/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

const customPostType = 'genesis_custom_block';

describe( 'TextBlock', () => {
	it( 'creates the block and makes it available in the block editor', async () => {
		const blockName = 'Testing Example';
		const fieldName = 'Testing Text';

		// Create the custom block (a 'genesis_custom_block' post).
		await visitAdminPage( 'post-new.php', `?post_type=${ customPostType }` );
		await queries.findByLabelText( await getDocument( page ), 'Block title' );
		await page.keyboard.type( blockName );

		const $editBlockDocument = await getDocument( page );
		const addFieldButton = await queries.findByLabelText( $editBlockDocument, 'Add a new field' );
		addFieldButton.click();

		await queries.findByLabelText( $editBlockDocument, 'Field Label' );
		await page.keyboard.type( fieldName );

		( await queries.findByText( $editBlockDocument, /publish/i ) ).click();
		await queries.findByText( $editBlockDocument, /published/i )

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
