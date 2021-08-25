/**
 * External dependencies
 */
import { getDocument, queries } from 'pptr-testing-library';

/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

const customPostType = 'genesis_custom_block';

describe( 'NoField', () => {
	it( 'creates a block with no field, and makes it available in the editor', async () => {
		const { findByText, findByLabelText } = queries;

		// Create a new block and publish it right away.
		await visitAdminPage( 'post-new.php', `?post_type=${ customPostType }` );
		const $editBlockDocument = await getDocument( page );
		await ( await findByLabelText( $editBlockDocument, /category/i ) ).select( 'media' );
		( await findByText( $editBlockDocument, /publish/i ) ).click();
		await findByText( $editBlockDocument, /update/i );

		// Create a new post and add the new block.
		await createNewPost();
		await insertBlock( 'block-' );
	} );
} );
