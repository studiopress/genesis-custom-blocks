/* global gcbEditor */

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getDefaultBlock } from '../helpers';
import { useBlock } from '../hooks';

/**
 * The category editor section.
 *
 * @return {React.ReactElement} The section to edit the block category.
 */
const CategorySection = () => {
	// @ts-ignore
	const { categories: initialCategories } = gcbEditor;
	const { block, changeBlock } = useBlock();
	const [ categories, setCategories ] = useState( initialCategories );
	const [ showNewCategoryForm, setShowNewCategoryForm ] = useState( false );
	const newCategoryId = 'add-new-category';

	/**
	 * Handles changing the category.
	 *
	 * @param {{ target: { value: React.SetStateAction<string> } }} event The event on changing the category.
	 */
	const handleChangeCategory = ( event ) => {
		if ( ! event.target ) {
			return;
		}
		const matchedCategories = categories.filter( ( category ) => {
			return event.target.value === category.slug;
		} );

		if ( ! matchedCategories.length ) {
			return;
		}
		const newCategory = matchedCategories[ 0 ];

		changeBlock( {
			category: {
				icon: newCategory.icon,
				slug: newCategory.slug,
				title: newCategory.title,
			},
		} );
	};

	/**
	 * Handless adding a new category name.
	 *
	 * @param {React.FormEvent<HTMLFormElement>} event The form submission event.
	 */
	const onSubmitCategoryName = ( event ) => {
		event.preventDefault();
		// @ts-ignore
		const newCategorySlug = event.target.elements ? event.target.elements[ newCategoryId ].value : '';

		const newCategory = {
			icon: null,
			slug: newCategorySlug,
			title: newCategorySlug,
		};

		setCategories(
			[
				...categories,
				newCategory,
			]
		);
		changeBlock( { category: newCategory } );
		setShowNewCategoryForm( ( previousValue ) => ! previousValue );
	};

	const isDefaultCategory = () => {
		return categories.some( ( cat ) => block.category && ( block.category.slug === cat.slug ) );
	};

	return (
		<div className="mt-5">
			<label className="text-sm" htmlFor="block-categories">{ __( 'Category', 'genesis-custom-blocks' ) }</label>
			<select /* eslint-disable-line jsx-a11y/no-onchange */
				className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				id="block-categories"
				value={ block.category && block.category.slug ? block.category.slug : getDefaultBlock().category.slug }
				onChange={ handleChangeCategory }
			>
				{ categories && Array.isArray( categories )
					? categories.map( ( category, index ) => {
						const categoryWithDefault = category || {};

						return (
							<option
								value={ category.slug }
								key={ `block-category-${ index }` }>
								{ categoryWithDefault.title
									? categoryWithDefault.title
									: categoryWithDefault.slug
								}
							</option>
						);
					} )
					: null
				}
				{ block.category && ! isDefaultCategory()
					? (
						<option
							value={ block && block.category ? block.category.slug : null }
							key="block-category-non-default"
						>
							{ block.category && block.category.title ? block.category.title : block.category.slug }
						</option>
					)
					: null
				}
			</select>
			<button
				className="text-sm text-blue-700 md:underline mt-2"
				onClick={ () => {
					setShowNewCategoryForm( ( previousValue ) => ! previousValue );
				} }
				aria-expanded={ showNewCategoryForm }
			>
				{ __( 'Add New Category', 'genesis-custom-blocks' ) }
			</button>
			{ showNewCategoryForm
				? <form onSubmit={ onSubmitCategoryName } key="hierarchical-terms-form">
					<label
						htmlFor={ newCategoryId }
						className="text-sm"
					>
						{ __( 'New Category Name', 'genesis-custom-blocks' ) }
					</label>
					<input
						type="text"
						id={ newCategoryId }
						className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
						required
					/>
					<button className="flex border border-gray-600 rounded-sm mt-2" type="submit">
						<span className="flex items-center h-8 px-3">
							{ __( 'Add New Category', 'genesis-custom-blocks' ) }
						</span>
					</button>
				</form>
				: null
			}
		</div>
	);
};

export default CategorySection;
