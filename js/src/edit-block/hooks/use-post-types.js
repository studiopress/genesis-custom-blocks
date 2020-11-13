/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * @typedef {Object} UsePostTypesReturn The return value of useBlock.
 * @property {Object} postTypes The post types, with their value and label.
 */

/**
 * Gets the block context.
 *
 * @return {UsePostTypesReturn} The block and a function to change it.
 */
const usePostTypes = () => {
	const parsedPostTypes = useSelect(
		( select ) => {
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
						value: postType.slug,
						label: postType.labels && postType.labels.name ? postType.labels.name : postType.slug,
					}
				);

				return accumulator;
			}, [] );
		},
		[]
	);

	return { postTypes: parsedPostTypes };
};

export default usePostTypes;
