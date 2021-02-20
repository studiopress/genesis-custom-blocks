/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * @typedef {Object} PostType The return value of useBlock.
 * @property {string} slug The slug of the post type.
 * @property {string} label The label of the post type.
 */

/**
 * @typedef {Object} UsePostTypesReturn The return value of useBlock.
 * @property {PostType[]} postTypes The post types, with their value and label.
 */

/**
 * Gets the post types context.
 *
 * @return {UsePostTypesReturn} The post types.
 */
const usePostTypes = () => ( {
	postTypes: useSelect(
		( select ) => {
			// @ts-ignore
			const postTypes = select( 'core' ).getPostTypes();

			if ( ! postTypes || ! postTypes.length ) {
				return [];
			}

			return postTypes.reduce( ( accumulator, postType ) => {
				if ( 'attachment' === postType.slug || ! postType.viewable ) {
					return accumulator;
				}

				accumulator.push(
					{
						slug: postType.slug,
						label: postType.labels && postType.labels.name ? postType.labels.name : postType.slug,
					}
				);

				return accumulator;
			}, [] );
		},
		[]
	),
} );

export default usePostTypes;
