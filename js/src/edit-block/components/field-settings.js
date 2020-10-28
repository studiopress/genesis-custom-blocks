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
 * Internal dependencies
 */
import { Text } from './settings';

/**
 * @typedef {Object} FieldSettingsProps The component props.
 * @property {Object} controls All of the possible controls.
 * @property {Object} field The current field.
 */

/**
 * The field settings.
 *
 * @param {FieldSettingsProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const FieldSettings = ( { controls, field } ) => {
	const control = controls[ field.control ];

	return (
		<>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-4">{ __( 'Field Width', 'genesis-custom-blocks' ) }</label>
				<div className="flex w-full border border-gray-600 rounded-sm mt-2">
					<button className="w-0 flex-grow h-8 rounded-sm text-sm focus:outline-none" id="setting-4">25%</button>
					<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">50%</button>
					<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">75%</button>
					<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">100%</button>
				</div>
			</div>
			<Text setting={ control.settings[ 2 ] } value={ field.help } />
			<Text setting={ control.settings[ 3 ] } value={ field.default } />
			<Text setting={ control.settings[ 4 ] } value={ field.placeholder } />
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-8">{ __( 'Character Limit', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" type="number" id="setting-8" />
			</div>
			<div className="flex justify-between mt-5 border-t border-gray-300 pt-3">
				<button className="flex items-center bg-red-200 text-sm h-6 px-2 rounded-sm leading-none text-red-700 hover:bg-red-500 hover:text-red-100">{ __( 'Delete', 'genesis-custom-blocks' ) }</button>
				<button className="flex items-center bg-blue-200 text-sm h-6 px-2 rounded-sm leading-none text-blue-700 hover:bg-blue-500 hover:text-blue-100">{ __( 'Duplicate', 'genesis-custom-blocks' ) }</button>
			</div>
		</>
	);
};

export default FieldSettings;
