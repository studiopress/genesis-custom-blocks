/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FormTokenField, Icon } from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useBlock, useCategories } from '../hooks';
import { getIconComponent } from '../../common/helpers';

/**
 * The field panel.
 *
 * @return {React.ReactElement} The field panel component.
 */
const BlockPanel = () => {
	const { block, changeBlock } = useBlock();
	const { categories, setCategories } = useCategories();
	const [ showNewCategoryForm, setShowNewCategoryForm ] = useState( false );
	const [ newCategorySlug, setNewCategorySlug ] = useState( '' );
	const maxNumberOfKeyword = 3;

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
		<div className="p-4">
			<h4 className="text-sm font-semibold">{ __( 'Block Settings', 'genesis-custom-blocks' ) }</h4>
			<div className="mt-5">
				<label className="text-sm" htmlFor="block-name">{ __( 'Slug', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					type="text"
					id="block-name"
					value={ block.name }
					onChange={ ( event ) => {
						if ( event.target ) {
							changeBlock( 'name', event.target.value );
						}
					} }
				/>
				<span className="block italic text-xs mt-1">{ __( 'Used to determine the name of the template file.', 'genesis-custom-blocks' ) }</span>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="block-icon">{ __( 'Icon', 'genesis-custom-blocks' ) }</label>
				<Icon size={ 24 } icon={ getIconComponent( block.icon ) } />
			</div>

			<div className="mt-5">
				<label className="text-sm" htmlFor="block-categories">{ __( 'Category', 'genesis-custom-blocks' ) }</label>
				<select /* eslint-disable-line jsx-a11y/no-onchange */
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					id="block-categories"
					value={ block.category && block.category.slug ? block.category.slug : null }
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

						changeBlock(
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
					{ isDefaultCategory() ? null : <option value={ block.category.slug } key="block-category-non-default">{ block.category.title ? block.category.title : block.category.slug }</option> }
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
							onChange={ handleChangeCategoryName }
							required
						/>
						<button type="submit">
							{ __( 'Add New Category', 'genesis-custom-blocks' ) }
						</button>
					</form>
					: null
				}
				<span className="block italic text-xs mt-1">{ __( 'Used to determine the name of the template file.', 'genesis-custom-blocks' ) }</span>
			</div>
			<div className="mt-5">
				<FormTokenField
					// @ts-ignore
					label={ __( 'Keywords', 'genesis-custom-blocks' ) }
					value={ block.keywords }
					maxLength={ maxNumberOfKeyword }
					onChange={ ( tokens ) => {
						changeBlock( 'keywords', tokens );
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
