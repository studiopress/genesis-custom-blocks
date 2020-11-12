/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getBlock } from '../helpers';

/**
 * @typedef {Object} UseBlockReturn The return value of useBlock.
 * @property {Object} block The block, parsed into an object.
 * @property {Function} changeBlock Changes the block configuration.
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
	const blockNameWithNamespace = Object.keys( fullBlock )[ 0 ];
	const block = fullBlock[ blockNameWithNamespace ];

	/**
	 * Changes a field setting.
	 *
	 * @param {string} settingKey The key of the setting, like 'label' or 'placeholder'.
	 * @param {any} newSettingValue The new setting value.
	 */
	const changeBlock = useCallback( ( key, newValue ) => {
		fullBlock[ blockNameWithNamespace ][ key ] = newValue;
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNamespace, editPost, fullBlock ] );

	return { block, changeBlock };
};

export default useBlock;
