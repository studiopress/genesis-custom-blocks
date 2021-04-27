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
		const { findByLabelText, findByRole, findByText } = queries;

		const field = {
			label: 'Text',
			name: 'text',
			type: 'text',
			value: 'Here is an example value for this',
		};
		const blockName = 'Test Template Editor';
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
		await ( await page.waitForSelector( '#gcb-template-editor' ) ).click();
		await page.keyboard.type( templateMarkup );

		await ( await findByText( $editBlockDocument, 'Editor Preview' ) ).click();
		await ( await findByLabelText( $editBlockDocument, field.label ) ).type( field.value );
		await ( await findByRole( $editBlockDocument, 'button', { name: /save draft/i } ) ).click();

		await ( await findByText( $editBlockDocument, 'Front-end Preview' ) ).click();
		await findByText( $editBlockDocument, `Here is the text field: ${ field.value }` )
	} );
} );
