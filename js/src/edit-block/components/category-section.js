/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useBlock, useCategories } from '../hooks';

/**
 * The category editor section.
 *
 * @return {React.ReactElement} The section to edit the block category.
 */
const CategorySection = () => {
	const { block, changeBlock } = useBlock();
	const { categories, setCategories } = useCategories();
	const [ showNewCategoryForm, setShowNewCategoryForm ] = useState( false );
	const [ newCategorySlug, setNewCategorySlug ] = useState( '' );

	/**
	 * Handles changing the category.
	 *
	 * @param {{ target: { value: React.SetStateAction<string>; }; }} event The event on changing the category.
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

		changeBlock(
			'category',
			{
				icon: newCategory.icon,
				slug: newCategory.slug,
				title: newCategory.title,
			}
		);
	};

	/**
	 * Handles changing the category name.
	 *
	 * @param {{ target: { value: React.SetStateAction<string>; }; }} event The event on changing the name.
	 */
	const handleChangeCategoryName = ( event ) => {
		if ( event.target ) {
			setNewCategorySlug( event.target.value );
		}
	};

	const onSubmitCategoryName = useCallback( ( event ) => {
		event.preventDefault();
		if ( ! newCategorySlug ) {
			return;
		}

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
		changeBlock(
			'category',
			newCategory
		);
		setShowNewCategoryForm( ( previousValue ) => ! previousValue );
	}, [ categories, changeBlock, newCategorySlug, setCategories ] );

	const isDefaultCategory = useCallback( () => {
		const matchedCategories = categories.filter( ( cat ) => {
			return block.category && ( block.category.slug === cat.slug );
		} );
		return matchedCategories.length > 0;
	}, [ categories, block ] );

	return (
		<div className="mt-5">
			<label className="text-sm" htmlFor="block-categories">{ __( 'Category', 'genesis-custom-blocks' ) }</label>
			<select /* eslint-disable-line jsx-a11y/no-onchange */
				className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				id="block-categories"
				value={ block.category && block.category.slug ? block.category.slug : null }
				onChange={ handleChangeCategory }
			>
				{ categories.map( ( category, index ) => {
					return <option value={ category.slug } key={ `block-category-${ index }` }>{ category.title ? category.title : category.slug }</option>;
				} ) }
				{ isDefaultCategory() ? null : <option value={ block.category.slug } key="block-category-non-default">{ block.category.title ? block.category.title : block.category.slug }</option> }
			</select>
			<button
				className="text-sm text-blue-600 focus:outline-none md:underline mt-2"
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
						htmlFor="add-new-category"
						className="text-sm"
					>
						{ __( 'New Category Name', 'genesis-custom-blocks' ) }
					</label>
					<input
						type="text"
						id="add-new-category"
						className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
						value={ newCategorySlug }
						onChange={ handleChangeCategoryName }
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
