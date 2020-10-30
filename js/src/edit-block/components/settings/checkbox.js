// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * @typedef {Object} CheckboxProps The component props.
 * @property {Function} handleOnChange Handles a change in this setting.
 * @property {Object} setting This setting.
 * @property {boolean|undefined} value The setting value.
 */

/**
 * The field settings.
 *
 * @param {CheckboxProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Checkbox = ( { handleOnChange, setting, value } ) => {
	const checkedValue = '1';
	const isChecked = value;
	const id = `setting-input-${ setting.name }`;

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<input
				type="checkbox"
				value={ checkedValue }
				checked={ isChecked }
				onChange={ ( event ) => {
					if ( event.target ) {
						handleOnChange( event.target.value );
					}
				} }
			/>
		</>
	)
};

export default Checkbox;
