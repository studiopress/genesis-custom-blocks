/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';

const useCategories = () => {
	const categories = useSelect(
		( select ) => select( 'core/blocks' ).getCategories(),
		[]
	);
	const { setCategories } = useDispatch( 'core/blocks' );

	return { categories, setCategories };
};

export default useCategories;
