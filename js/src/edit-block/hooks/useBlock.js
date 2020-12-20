/* global gcbEditor */

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { BLOCK_NAMESPACE } from '../constants';
import {
	getBlock,
	getBlockNameWithNameSpace,
	getDefaultBlock,
} from '../helpers';

/**
 * @typedef {Object} Category A block category.
 * @property {string} slug The slug.
 * @property {string} title Like a pretty-printed slug.
 * @property {string|null} [icon] The icon for the category, not used anymore.
 */

/**
 * @callback ChangeBlockName Changes the name of a block.
 * @param {string} newName The new bock name (slug).
 * @param {Object} [defaultValues] The new block values, if any.
 */

/**
 * @typedef {Object} Block A block configuration.
 * @property {string} name The name (slug).
 * @property {string} title Often a pretty-printed version of the slug.
 * @property {Category} category The block category, including slug and title properties.
 * @property {Object} fields Key/value pairs of Field objects.
 * @property {string} icon The block icon, like 'genesis_custom_block'.
 * @property {string[]} keywords The keywords, max 3.
 * @property {string[]} [excluded] The excluded post tpes, if any.
 */

/**
 * @typedef {Object} UseBlockReturn The return value of useBlock.
 * @property {Block} block The block, parsed into an object.
 * @property {function(Object):void} changeBlock Changes the block configuration.
 */

/**
 * Gets the block context.
 *
 * @return {UseBlockReturn} The block and a function to change it.
 */
const useBlock = () => {
	// @ts-ignore
	const { postId } = gcbEditor;
	const editedPostContent = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostContent(),
		[]
	);
	const { editPost } = useDispatch( 'core/editor' );

	const fullBlock = getBlock( editedPostContent );
	const blockNameWithNameSpace = getBlockNameWithNameSpace( fullBlock );
	const block = fullBlock[ blockNameWithNameSpace ] || {};

	/**
	 * Changes a block's values.
	 *
	 * Does not overwrite the whole block, only the values
	 * passed in newValues.
	 *
	 * @param {Object} newValues The new value(s) to set.
	 */
	const changeBlock = ( newValues ) => {
		const newBlock = {
			...getDefaultBlock( postId ),
			...block,
			...newValues,
		};

		editPost( {
			content: JSON.stringify( {
				[ `${ BLOCK_NAMESPACE }/${ newBlock.name }` ]: newBlock,
			} ),
			slug: newBlock.name,
			title: newBlock.title,
		} );
	};

	return {
		block,
		changeBlock,
	};
};

export default useBlock;
