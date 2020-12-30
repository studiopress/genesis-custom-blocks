/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * @typedef {Object} Category A block category.
 * @property {string} slug The name of the category.
 * @property {string} title The title of the category.
 * @property {string|null} [icon] The icon, not usually present.
 */

/**
 * @typedef {Object} UseCategoriesReturn The return value of useCategories.
 * @property {Category[]} categories The block categories.
 * @property {Function} setCategories Sets the block configuration.
 */

/**
 * Gets the categories context.
 *
 * @return {UseCategoriesReturn} The categories and a function to set them.
 */
const useCategories = () => {
	const noCategories = [];
	const [ categories, setCategories ] = useState( noCategories );
	const { createErrorNotice } = useDispatch( 'core/notices' );

	useEffect( () => {
		apiFetch( {	path: '/genesis-custom-blocks/block-categories' } )
			.then(
				/**
				 * Sets categories.
				 *
				 * @param {Category[]} response The response from the REST request.
				 */
				( response ) => {
					setCategories(
						Array.isArray( response )
							? response.filter( ( category ) => category.hasOwnProperty( 'slug' ) && category.hasOwnProperty( 'title' ) )
							: noCategories
					);
				}
			).catch(
				/**
				 * Creates an error notice.
				 *
				 * @param {Error} error The error from the request.
				 */
				( error ) => {
					createErrorNotice(
						sprintf(
							/* translators: %1$s: the error message from the request */
							__( 'Failed to get the categories: %1$s', 'genesis-custom-blocks' ),
							error.message
						)
					);
				}
			);
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps

	return { categories, setCategories };
};

export default useCategories;
