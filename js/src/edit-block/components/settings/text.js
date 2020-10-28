// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * @typedef {Object} FieldSettingsProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 */

/**
 * The field settings.
 *
 * @param {FieldSettingsProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Text = ( { setting, value } ) => {
	return (
		<div className="mt-5">
			<label className="text-sm" htmlFor="setting-5">{ setting.label }</label>
			<input
				className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				type="text"
				id="setting-5"
				value={ value }
			/>
		</div>
	);
};

export default Text;
