/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';

/**
 * @typedef {Object} UseEditorReturn The return value of useEditor.
 * @property {function(Object):void} setupEditor Sets up the editor.
 */

/**
 * Gets the editor context.
 *
 * @return {UseEditorReturn} The field context and functions to change it.
 */
const useEditor = () => {
	const { setEditedPost } = useDispatch( 'core/editor' );

	/**
	 * Initializes the editor with the specified post object and editor settings.
	 *
	 * Forked from setupEditor() in Gutenberg.
	 * Removed the lines that parse the blocks,
	 * as they can cause getEditedPostContent() to return ''.
	 * That function tries to parse blocks, but this doesn't have block comments like in Gutenberg.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/8d5fd89f573e00601b189b1a2f87d5bc7b862349/packages/editor/src/store/actions.js#L38
	 *
	 * @param {number} postId Post ID.
	 */
	const setupEditor = ( postId ) => {
		setEditedPost( 'genesis_custom_block', postId );
	};

	return { setupEditor };
};

export default useEditor;
