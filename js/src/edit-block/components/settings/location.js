// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * @typedef {Object} LocationProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 */

/**
 * The field settings.
 *
 * @param {LocationProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Location = ( { setting, value } ) => {
	const locations = [
		{ 
			value: 'editor',
			label: __( 'Editor', 'genesis-custom-blocks' ),
		},
		{ 
			value: 'inspector',
			label: __( 'Inspector', 'genesis-custom-blocks' ),
		},
	];
	const id = `setting-${ setting.name }`;

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<select
				value={ value }
				id={ id }
				name={ id }
				className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
			>
				{
					locations.map( ( location ) => {
						return (
							<option
								value={ location.value }
								key={ `location-option-${ location.value }` }
							>
								{ location.label }
							</option>
						);
					} )
				}
			</select>
		</>
	);
};

export default Location;
