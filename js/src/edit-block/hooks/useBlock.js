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
 * @property {import('../components/editor').Field[]} fields The fields, including their settings.
 * @property {string} icon The block icon, like 'genesis_custom_block'.
 * @property {string[]} keywords The keywords, max 3.
 */

/**
 * @typedef {Object} UseBlockReturn The return value of useBlock.
 * @property {Block} block The block, parsed into an object.
 * @property {function(Object):void} changeBlock Changes the block configuration.
 * @property {ChangeBlockName} changeBlockName Changes the block name.
 * @property {function(number):void} setDefaults Sets defaults for properties that don't exist.
 */

/**
 * Gets the block context.
 *
 * @return {UseBlockReturn} The block and a function to change it.
 */
const useBlock = () => {
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
		const blockName = getBlockNameWithNameSpace( fullBlock );
		const editedPost = {
			content: JSON.stringify(
				{
					[ blockName ]: {
						...fullBlock[ blockName ],
						...newValues,
					},
				}
			),
		};

		if ( newValues.hasOwnProperty( 'title' ) ) {
			editedPost.title = newValues.title;
		}

		editPost( editedPost );
	};

	/**
	 * Changes a block name (slug).
	 *
	 * @param {string} newName The new bock name (slug).
	 * @param {Object} [defaultValues] The new block values, if any.
	 */
	const changeBlockName = ( newName, defaultValues = {} ) => {
		const previousBlockName = getBlockNameWithNameSpace( fullBlock );
		const editedPost = {
			content: JSON.stringify( {
				[ `${ BLOCK_NAMESPACE }/${ newName }` ]: {
					...fullBlock[ previousBlockName ],
					...defaultValues,
					name: newName,
				},
			} ),
			name: newName,
		};

		if ( defaultValues.hasOwnProperty( 'title' ) ) {
			editedPost.title = defaultValues.title;
		}

		editPost( editedPost );
	};

	/**
	 * If a block property doesn't exist, add a default.
	 *
	 * @param {number} postId The current post ID.
	 */
	const setDefaults = ( postId ) => {
		const defaultBlock = getDefaultBlock( postId );
		const blockName = block.name ? block.name : defaultBlock.name;

		editPost( {
			content: JSON.stringify( {
				[ `${ BLOCK_NAMESPACE }/${ blockName }` ]: {
					...defaultBlock,
					...block,
				},
			} ),
			name: blockName,
		} );
	};

	return {
		block,
		changeBlock,
		changeBlockName,
		setDefaults,
	};
};

export default useBlock;
