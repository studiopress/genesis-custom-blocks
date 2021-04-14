/**
 * External dependencies
 */
import { getDocument, queries } from 'pptr-testing-library';

/**
 * WordPress dependencies
 */
import { visitAdminPage } from '@wordpress/e2e-test-utils';

const customPostType = 'genesis_custom_block';

describe( 'TemplateEditor', () => {
	it( 'creates a block with the template editor', async () => {
		const { findByText, findByLabelText } = queries;

		const field = {
			label: 'Text',
			name: 'text',
			type: 'text',
		};
		const blockName = 'Test Text';
		const templateMarkup = `Here is the text field: {{${ field.name }}}`;

		await visitAdminPage( 'post-new.php', `?post_type=${ customPostType }` );
		await findByLabelText( await getDocument( page ), 'Block title' );
		await page.keyboard.type( blockName );

		const $editBlockDocument = await getDocument( page );
		await ( await findByLabelText( $editBlockDocument, 'Add a new field' ) ).click();
		await findByLabelText( $editBlockDocument, 'Field Label' );

		await page.keyboard.type( field.label );
		await page.select( '#field-control', field.type );
		await ( await findByText( $editBlockDocument, 'Template Editor' ) ).click();
		( await page.waitForSelector( '#gcb-template-editor' ) ).type( templateMarkup );
	} );
} );
