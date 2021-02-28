/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Gets the default block.
 *
 * @param {number|null} postId The id of the post, if any.
 * @return {import('../hooks/useBlock').Block} The default block.
 */
const getDefaultBlock = ( postId = null ) => {
	const name = postId ? `block-${ postId }` : 'block';

	return {
		name,
		title: name,
		excluded: [],
		icon: 'genesis_custom_blocks',
		category: {
			icon: null,
			slug: 'text',
			title: __( 'Text', 'genesis-custom-blocks' ),
		},
		keywords: [],
		fields: {},
	};
};

export default getDefaultBlock;
