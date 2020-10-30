/**
 * External dependencies
 */
import React from 'react';

/**
 * @typedef {Object} SelectProps The component props.
 * @property {Function} handleOnChange Handles a change in this setting.
 * @property {string} id The id attribute.
 * @property {Array} options The options, including their label and value.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 */

/**
 * The field settings.
 *
 * @param {SelectProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Select = ( { handleOnChange, setting, id, value, options } ) => {
	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<select /* eslint-disable-line jsx-a11y/no-onchange */
				value={ value }
				id={ id }
				name={ id }
				className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				onChange={ ( event ) => {
					if ( event.target ) {
						handleOnChange( event.target.value );
					}
				} }
			>
				{
					options.map( ( location ) => {
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

export default Select;
