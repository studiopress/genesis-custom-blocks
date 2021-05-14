/**
 * External dependencies
 */
import * as React from 'react';

/**
 * Converts the default setting to a string.
 *
 * @param {Array|*} initial The default setting as an array, or another type that will be returned.
 * @return {string|*} The setting converted to a string, or if passed a non-array, the same type it was passed.
 */
const convertDefaultArrayToString = ( initial ) => {
	return Array.isArray( initial )
		? initial.join( '\n' )
		: initial;
};

/**
 * Converts the default setting to an array.
 *
 * @param {string|*} initial The settings default as a string, or another type that will be returned.
 * @return {Array|*} The setting converted to an array, or if passed a non-string, the same type it was passed.
 */
const convertDefaultStringToArray = ( initial ) => {
	return 'string' === typeof initial
		? initial.split( /\r\n|[\r\n]/ )
		: initial;
};

/**
 * @typedef {Object} TextareaDefaultProps The component props.
 * @property {Function} handleOnChange Handles a change in this setting.
 * @property {import('../editor').Setting} setting This setting.
 * @property {Array|undefined} value The setting value.
 */

/**
 * The textarea default component.
 *
 * @param {TextareaDefaultProps} props The component props.
 * @return {React.ReactElement} The textarea default component.
 */
const TextareaDefault = ( { handleOnChange, setting, value } ) => {
	const id = `setting-textarea-default-${ setting.name }`;
	const stringValue = convertDefaultArrayToString( value );
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
						handleOnChange( convertDefaultStringToArray( event.target.value ) );
					}
				} }
				value={ textAreaValue }
			/>
			<p className="block italic text-xs mt-1">
				{ setting.help }
			</p>
		</>
	);
};

export default TextareaDefault;
