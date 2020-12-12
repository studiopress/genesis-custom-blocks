/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
/**
 * External dependencies
 */
import { useCallback } from 'react';

/**
 * @typedef {Object} UseEditorReturn The return value of useEditor.
 * @property {Function} setupEditor Sets up the editor.
 */

/**
 * Gets the field context.
 *
 * @return {UseEditorReturn} The field context and functions to change it.
 */
const useEditor = () => {
	const { editPost, setupEditorState, resetPost } = useDispatch( 'core/editor' );

	const setupEditor = useCallback(
		/**
		 * Returns an action generator used in signalling that editor has initialized with
		 * the specified post object and editor settings.
		 *
		 * Forked from setupEditor in Gutenberg.
		 *
		 * @see https://github.com/WordPress/gutenberg/blob/8d5fd89f573e00601b189b1a2f87d5bc7b862349/packages/editor/src/store/actions.js#L38
		 *
		 * @param {Object} post Post object.
		 * @param {Object} edits Initial edited attributes object.
		 */
		( post, edits ) => {
			resetPost( post );
			setupEditorState( post );
			if (
				edits &&
				Object.keys( edits ).some(
					( key ) =>
						edits[ key ] !== post &&
						post.hasOwnProperty( key ) && post.key.hasOwnProperty( 'raw' )
							? post[ key ].raw
							: post[ key ]
				)
			) {
				editPost( edits );
			}
		},
		[ editPost, setupEditorState, resetPost ]
	);

	return { setupEditor };
};

export default useEditor;
