/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { TextareaControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { EditorHistoryRedo, EditorHistoryUndo } from '@wordpress/editor';
import { useCallback } from '@wordpress/element';

/**
 * The fields component.
 *
 * @return {React.ReactElement} The fields component.
 */
const Fields = () => {
	const content = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostContent(),
		[]
	);
	const { editPost } = useDispatch( 'core/editor' );

	const storeEditedPost = useCallback( ( newContent ) => {
		editPost( { content: newContent } );
	}, [ editPost ] );

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

export default Fields;
