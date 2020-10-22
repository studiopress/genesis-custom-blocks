// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { TextareaControl } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { EditorHistoryRedo, EditorHistoryUndo } from '@wordpress/editor';

/**
 * The migration admin page.
 *
 * @param {Object} props The component props.
 * @param {string} props.content The post content.
 * @param {Function} props.storeEditedPost Stores the edited post.
 * @return {React.ReactElement} The component for the admin page.
 */
const Fields = ( { content, storeEditedPost } ) => {
	return (
		<div>
			<TextareaControl
				value={ content }
				onChange={ ( newValue ) => {
					storeEditedPost( newValue );
				} }
			/>
			<EditorHistoryUndo />
			<EditorHistoryRedo />
		</div>
	);
};

export default compose( [
	withSelect( ( select ) => {
		const { getCurrentPostId, getCurrentPostType } = select( 'core/editor' );
		const { getEditedEntityRecord } = select( 'core' );
		const record = getEditedEntityRecord( 'postType', getCurrentPostType(), getCurrentPostId() );
		return { content: record.content };
	} ),
	withDispatch( ( dispatch ) => {
		const { editPost } = dispatch( 'core/editor' );
		const { toggleBlockMode } = dispatch( 'core/block-editor' );

		const storeEditedPost = ( newContent ) => {
			editPost( { content: newContent } );
		};

		return {
			storeEditedPost,
			toggleBlockMode,
		};
	} ),
] )( Fields );
