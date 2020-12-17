/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BLOCK_NAMESPACE } from '../constants';
import {
	getBlock,
	getBlockNameWithNameSpace,
} from '../helpers';

/**
 * @typedef {Object} Category A block category.
 * @property {string} slug The slug.
 * @property {string} title Like a pretty-printed slug.
 * @property {string|null} [icon] The icon for the category, not used anymore.
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
 * @property {function(string,Object):void} changeBlockName Changes the block name.
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

	const getFullBlock = useCallback(
		() => getBlock( editedPostContent ),
		[ editedPostContent ]
	);

	const fullBlock = getFullBlock();

	const blockNameWithNameSpace = getBlockNameWithNameSpace( fullBlock );
	const block = useMemo(
		() => fullBlock[ blockNameWithNameSpace ] || {},
		[ fullBlock, blockNameWithNameSpace ]
	);

	const changeBlock = useCallback(
		/**
		 * Changes a block's values.
		 *
		 * Does not overwrite the whole block, only the values
		 * passed in newValues.
		 *
		 * @param {Object} newValues The new value(s) to set.
		 */
		( newValues ) => {
			const newBlock = getFullBlock();
			const blockName = getBlockNameWithNameSpace( newBlock );
			const editedPost = {
				content: JSON.stringify(
					{
						[ blockName ]: {
							...newBlock[ blockName ],
							...newValues,
						},
					}
				),
			};

			if ( newValues.hasOwnProperty( 'title' ) ) {
				editedPost.title = newValues.title;
			}

			editPost( editedPost );
		},
		[ editPost, getFullBlock ]
	);

	const changeBlockName = useCallback(
		/**
		 * Changes a block name (slug).
		 *
		 * @param {string} newName The new bock name (slug).
		 * @param {Object} defaultValues The new block values, if any.
		 */
		( newName, defaultValues = {} ) => {
			const previousBlock = getFullBlock();
			const previousBlockName = getBlockNameWithNameSpace( previousBlock );
			const editedPost = {
				content: JSON.stringify( {
					[ `${ BLOCK_NAMESPACE }/${ newName }` ]: {
						...previousBlock[ previousBlockName ],
						...defaultValues,
						name: newName,
					},
				} ),
			};

			if ( defaultValues.hasOwnProperty( 'title' ) ) {
				editedPost.title = defaultValues.title;
			}

			editPost( editedPost );
		},
		[ editPost, getFullBlock ]
	);

	return {
		block,
		changeBlock,
		changeBlockName,
	};
};

export default useBlock;
