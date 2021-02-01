/**
 * External dependencies
 */
import * as React from 'react';

/**
 * @typedef {Object} CheckboxProps The component props.
 * @property {Function} handleOnChange Handles a change in this setting.
 * @property {Object} setting This setting.
 * @property {number|undefined} value The setting value.
 */

/**
 * The checkbox component.
 *
 * @param {CheckboxProps} props The checkbox props.
 * @return {React.ReactElement} The checkbox component.
 */
const Checkbox = ( { handleOnChange, setting, value } ) => {
	const checked = '1';
	const isChecked = 'undefined' === typeof value
		? setting.default
		: Boolean( value );
	const id = `setting-input-${ setting.name }`;

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<input
				id={ id }
				className="ml-2"
				type="checkbox"
				value={ String( checked ) }
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
