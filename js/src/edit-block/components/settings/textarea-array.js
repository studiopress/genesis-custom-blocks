/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { convertToArray, convertToString } from '../../helpers';

/**
 * @typedef {Object} TextareaArrayProps The component props.
 * @property {Object} setting This setting.
 * @property {Array|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change in this setting.
 */

/**
 * The field settings.
 *
 * @param {TextareaArrayProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const TextareaArray = ( { handleOnChange, setting, value } ) => {
	const id = `setting-textarea-array-${ setting.name }`;
	const stringValue = convertToString( value );
	const textAreaValue = undefined === stringValue ? setting.default : stringValue;

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<textarea
				id={ id }
				className="flex items-center w-full rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				rows={ 6 }
				onChange={ ( event ) => {
					if ( event.target ) {
						handleOnChange( convertToArray( event.target.value ) );
					}
				} }
				value={ textAreaValue }
			/>
		</>
	);
};

export default TextareaArray;
