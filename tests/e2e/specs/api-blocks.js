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
} from '@wordpress/e2e-test-utils';

describe( 'ApiBlocks', () => {
	it( 'displays PHP-registered blocks', async () => {
		const { findAllByText, findByLabelText } = queries;
		await createNewPost();
		const $blockEditorDocument = await getDocument( page );

		await insertBlock( 'Test Url' );
		await findAllByText( $blockEditorDocument, 'Test Url' );
		await findByLabelText( $blockEditorDocument, 'Url Here' );

		await insertBlock( 'Test Text' );
		await findAllByText( $blockEditorDocument, 'Test Text' );
		await findByLabelText( $blockEditorDocument, 'Enter some text here' );
	} );
} );
