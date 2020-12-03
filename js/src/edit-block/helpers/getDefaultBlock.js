/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Gets the default block.
 *
 * @param {number|null} postId The id of the post, if any.
 * @return {Object} The default block.
 */
const getDefaultBlock = ( postId = null ) => {
	const name = postId ? `block-${ postId }` : 'block';

	return {
		name,
		category: {
			icon: null,
			slug: 'text',
			title: __( 'Text', 'genesis-custom-blocks' ),
		},
		icon: 'genesis_custom_blocks',
	};
};

export default getDefaultBlock;
