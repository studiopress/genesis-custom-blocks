/**
 * External dependencies
 */
import React from 'react';

/**
 * @typedef {Object} InputProps The component props.
 * @property {Function} handleOnChange Handles a change in this setting.
 * @property {Object} setting This setting.
 * @property {string} type The type of <input>, like 'text'.
 * @property {string|undefined} value The setting value.
 * @property {number} [min] The min attribute of an input[type="number"].
 */

/**
 * The field settings.
 *
 * @param {InputProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Input = ( { handleOnChange, setting, type, value, min } ) => {
	const id = `setting-input-${ setting.name }`;
	const inputValue = undefined === value ? setting.default : value;

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<input
				className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				type={ type }
				id={ id }
				value={ inputValue }
				min={ min }
				onChange={ ( event ) => {
					if ( event.target ) {
						handleOnChange( event.target.value );
					}
				} }
			/>
		</>
	);
};

export default Input;
