/**
 * External dependencies
 */
import React from 'react';

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
	/**
	 * Converts the setting to a string.
	 *
	 * @param {Array} settingValues The settings values.
	 * @return {string} The setting converted to a string.
	 */
	const convertToString = ( settingValues ) => {
		if ( ! Array.isArray( settingValues ) ) {
			return settingValues;
		}

		return settingValues.reduce( ( accumulator, settingValue ) => {
			if ( 'string' === typeof settingValue ) {
				return accumulator + settingValue + '\n';
			}

			if ( ! settingValue.hasOwnProperty( 'value' ) || ! settingValue.hasOwnProperty( 'label' ) ) {
				return accumulator;
			}

			if ( settingValue.value === settingValue.label ) {
				return accumulator + settingValue.label + '\n';
			}

			return accumulator + settingValue.value + ' : ' + settingValue.label + '\n';
		}, '' ).trim();
	};

	/**
	 * Converts the setting to an array.
	 *
	 * @param {string} settingValues The settings values.
	 * @return {Array} The setting converted to a string.
	 */
	const convertToArray = ( settingValues ) => {
		return settingValues
			.split( /\r\n|[\r\n]/ )
			.reduce( ( accumulator, option ) => {
				const splitOption = option.split( ':' );
				if ( 2 !== splitOption.length ) {
					return accumulator;
				}

				return [
					...accumulator,
					{
						value: splitOption[ 0 ].trim(),
						label: splitOption[ 1 ].trim(),
					},
				];
			}, [] );
	};

	const id = `setting-textarea-array-${ setting.name }`;
	const stringValue = convertToString( value );

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
			>
				{ stringValue }
			</textarea>
		</>
	);
};

export default TextareaArray;
