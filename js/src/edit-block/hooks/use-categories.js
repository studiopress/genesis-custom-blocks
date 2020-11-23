/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * @typedef {Object} UseCategoriesReturn The return value of useCategories.
 * @property {Array} categories The block categories.
 * @property {Function} setCategories Sets the block configuration.
 */

/**
 * Gets the categories context.
 *
 * @return {UseCategoriesReturn} The categories and a function to set them.
 */
const useCategories = () => {
	const categories = useSelect(
		( select ) => select( 'core/blocks' ).getCategories(),
		[]
	);
	const { setCategories } = useDispatch( 'core/blocks' );

	return { categories, setCategories };
};

export default useCategories;
