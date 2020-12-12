/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BLOCK_NAMESPACE } from '../constants';
import { getBlock, getBlockNameWithNameSpace } from '../helpers';

/**
 * @typedef {Object} UseBlockReturn The return value of useBlock.
 * @property {Object} block The block, parsed into an object.
 * @property {Function} changeBlock Changes the block configuration.
 * @property {Function} changeBlockName Changes the block name.
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

	/**
	 * Changes a block's values.
	 *
	 * Does not overwrite the whole block, only the values
	 * passed in newValues.
	 *
	 * @param {Object} newValues The new value(s) to set.
	 * @param {any} newSettingValue The new block value.
	 */
	const changeBlock = useCallback( ( newValues ) => {
		const newBlock = getFullBlock();
		const previousBlockName = getBlockNameWithNameSpace( newBlock );

		newBlock[ previousBlockName ] = {
			...newBlock[ previousBlockName ],
			...newValues,
		};
		editPost( { content: JSON.stringify( newBlock ) } );
	}, [ editPost, getFullBlock ] );

	/**
	 * Changes a block name (slug).
	 *
	 * @param {string} newName The new bock name (slug).
	 * @param {Object} defaultValues The new block values, if any.
	 */
	const changeBlockName = useCallback( ( newName, defaultValues = {} ) => {
		const previousBlock = getFullBlock();
		const previousBlockName = getBlockNameWithNameSpace( previousBlock );

		const newBlock = {
			[ `${ BLOCK_NAMESPACE }/${ newName }` ]: {
				...previousBlock[ previousBlockName ],
				...defaultValues,
				name: newName,
			},
		};
		editPost( { content: JSON.stringify( newBlock ) } );
	}, [ editPost, getFullBlock ] );

	return {
		block,
		changeBlock,
		changeBlockName,
	};
};

export default useBlock;
