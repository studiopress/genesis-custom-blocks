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
	const isChecked = value;
	const checked = '1';
	const id = `setting-input-${ setting.name }`;

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<input
				id={ id }
				type="checkbox"
				value={ checked }
				checked={ isChecked }
				onChange={ ( event ) => {
					if ( event.target ) {
						handleOnChange( event.target.checked );
					}
				} }
			/>
		</>
	);
};

export default Checkbox;
