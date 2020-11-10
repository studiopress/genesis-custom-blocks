/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
				<label className="text-sm" htmlFor="block-keywords">{ __( 'Keywords', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm font-mono"
					type="text"
					id="block-keywords"
					value={ field.keywords }
					onChange={ ( event ) => {
						if ( event.target ) {
							changeFieldSetting( 'keywords', event.target.value );
						}
					} }
				/>
				<span className="block italic text-xs mt-1">{ __( 'A comma separated list of keywords, used when searching. Maximum of 3.', 'genesis-custom-blocks' ) }</span>
			</div>
		</div>
	);
};

export default BlockPanel;
