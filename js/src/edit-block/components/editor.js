// @ts-check

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import {
	EditorProvider,
	PostTitle,
	PostPublishButton,
	PostSavedState,
} from '@wordpress/editor';
import { useEffect } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { BrowserURL, Fields } from './';

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
	}, [ post ] );

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
				<PostTitle />
				<PostSavedState />
				<PostPublishButton />
				<Fields />
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
		// which gets the blocks if they exist.
		// But this editor doesn't use blocks.
		// With this, getEditedPostContent() defaults
		// to returning the post content, instead of
		// parsing [] blocks and returning ''.
		removeBlocks: () => {
			if ( ! post ) {
				return;
			}

			dispatch( 'core' ).editEntityRecord(
				'postType',
				postType,
				postId,
				{ blocks: null }
			);
		},
	} ) ),
] )( Editor );
