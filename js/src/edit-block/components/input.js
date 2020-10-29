// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * @typedef {Object} InputProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {string} type The type of <input>, like 'text'.
 * @property {number} [min] The min attribute of an input[type="number"].
 */

/**
 * The field settings.
 *
 * @param {InputProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Input = ( { setting, value, type, min } ) => {
	const id = `setting-input-${ setting.name }`;

	return (
		<div className="mt-5">
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<input
				className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				type={ type }
				id={ id }
				value={ value }
				min={ min }
			/>
		</div>
	);
};

export default Input;
