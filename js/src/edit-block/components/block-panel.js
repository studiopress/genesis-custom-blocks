/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useField } from '../hooks';

/**
 * The field panel.
 *
 * @return {React.ReactElement} The field panel component.
 */
const BlockPanel = () => {
	const { field, changeFieldSetting } = useField();
	const categories = useSelect(
		( select ) => select( 'core/blocks' ).getCategories(),
		[]
	);
	const { setCategories } = useDispatch( 'core/blocks' );
	const [ showNewCategoryForm, setShowNewCategoryForm ] = useState( false );
	const [ newCategorySlug, setNewCategorySlug ] = useState( '' );
	const maxNumberOfKeyword = 3;
	const onChangeCategoryName = ( event ) => {
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
		changeFieldSetting(
			'category',
			newCategory
		);
		setShowNewCategoryForm( ( previousValue ) => ! previousValue );
	}, [ categories, changeFieldSetting, newCategorySlug, setCategories ] );

	const isDefaultCategory = useCallback( () => {
		const matchedCategories = categories.filter( ( cat ) => {
			return field.category && ( field.category.slug === cat.slug );
		} );
		return matchedCategories.length > 0;
	}, [ categories, field ] );

	return (
		<div className="p-4">
			<h4 className="text-sm font-semibold">{ __( 'Block Settings', 'genesis-custom-blocks' ) }</h4>
			<div className="mt-5">
				<label className="text-sm" htmlFor="block-name">{ __( 'Slug', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					type="text"
					id="block-name"
					value={ field.name }
					onChange={ ( event ) => {
						if ( event.target ) {
							changeFieldSetting( 'name', event.target.value );
						}
					} }
				/>
				<span className="block italic text-xs mt-1">{ __( 'Used to determine the name of the template file.', 'genesis-custom-blocks' ) }</span>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="block-categories">{ __( 'Category', 'genesis-custom-blocks' ) }</label>
				<select /* eslint-disable-line jsx-a11y/no-onchange */
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					id="block-categories"
					value={ field.category && field.category.slug ? field.category.slug : null }
					onChange={ ( event ) => {
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

						changeFieldSetting(
							'category',
							{
								icon: newCategory.icon,
								slug: newCategory.slug,
								title: newCategory.title,
							}
						);
					} }
				>
					{ categories.map( ( category, index ) => {
						return <option value={ category.slug } key={ `block-category-${ index }` }>{ category.title ? category.title : category.slug }</option>;
					} ) }
					{ isDefaultCategory() ? null : <option value={ field.category.slug } key="block-category-non-default">{ field.category.title ? field.category.title : field.category.slug }</option> }
				</select>
				<button
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
							className="editor-post-taxonomies__hierarchical-terms-label"
						>
							{ __( 'New Category Name', 'genesis-custom-blocks' ) }
						</label>
						<input
							type="text"
							id="add-new-category"
							className="editor-post-taxonomies__hierarchical-terms-input"
							value={ newCategorySlug }
							onChange={ onChangeCategoryName }
							required
						/>
						<button type="submit">
							{ __( 'Add New Category', 'genesis-custom-blocks' ) }
						</button>
					</form>
					:					null
				}
				<span className="block italic text-xs mt-1">{ __( 'Used to determine the name of the template file.', 'genesis-custom-blocks' ) }</span>
			</div>
			<div className="mt-5">
				<FormTokenField
					// @ts-ignore
					label={ __( 'Keywords', 'genesis-custom-blocks' ) }
					value={ field.keywords }
					maxLength={ maxNumberOfKeyword }
					onChange={ ( tokens ) => {
						changeFieldSetting( 'keywords', tokens );
					} }
					messages={ {
						added: __( 'Keyword added.', 'genesis-custom-blocks' ),
						removed: __( 'Keyword removed.' ),
						remove: __( 'Remove keyword' ),
					} }
				/>
			</div>
		</div>
	);
};

export default BlockPanel;
