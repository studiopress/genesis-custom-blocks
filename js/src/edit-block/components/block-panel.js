/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

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
	const maxNumberOfKeyword = 3;

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
						return <option value={ category.slug } key={ `block-category-${ index }` }>{ category.title }</option>;
					} ) }
				</select>
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
