/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import {
	EditorNotices,
	EditorProvider,
	PostTitle,
} from '@wordpress/editor';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BrowserURL, Header, Side } from './';

/**
 * The migration admin page.
 *
 * @param {Object} props The component props.
 * @return {React.ReactElement} The main editor component.
 */
const Editor = ( props ) => {
	const { post, settings, initialEdits, removeBlocks } = props;

	useEffect( () => {
		removeBlocks();
	}, [ removeBlocks, post ] );

	if ( ! post ) {
		return null;
	}

	return (
		<>
			<BrowserURL />
			<EditorProvider
				settings={
					{
						...settings,
						richEditingEnabled: false,
					}
				}
				post={ post }
				initialEdits={ initialEdits }
				useSubRegistry={ false }
			>
				<EditorNotices />
				<Header />
				<PostTitle />
				<Side />
			</EditorProvider>
		</>
	);
};

export default compose( [
	withSelect( ( select, { postId, postType } ) => {
		const { getEntityRecord } = select( 'core' );

		return {
			post: getEntityRecord( 'postType', postType, postId ),
		};
	} ),
	withDispatch( ( dispatch, { postId, postType, post } ) => ( {
		// A hack to remove blocks from the edited entity.
		// The stores use getEditedPostContent(),
		// which gets the blocks if the .blocks propety exists.
		// But this editor doesn't use blocks.
		// This change makes getEditedPostContent()
		// return the post content, instead of
		// parsing [] blocks and returning ''.
		removeBlocks: () => {
			if ( ! post ) {
				return;
			}

			// @ts-ignore
			dispatch( 'core' ).editEntityRecord(
				'postType',
				postType,
				postId,
				{ blocks: null }
			);
		},
	} ) ),
] )( Editor );
