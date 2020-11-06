/**
 * Internal dependencies
 */
import { TEXT_ARRAY_DELIMITER } from '../constants';

/**
 * Converts the setting to a string.
 *
 * @param {*} settingValues The settings values as an Array, or another type that will be returned right away.
 * @return {*} The setting converted to a string, or if passed a non-Array, the same type it was passed.
 */
const convertSettingsArrayToString = ( settingValues ) => {
	if ( ! Array.isArray( settingValues ) ) {
		return settingValues;
	}

	return settingValues.reduce( ( accumulator, settingValue ) => {
		if ( 'string' === typeof settingValue ) {
			return accumulator + settingValue;
		}

		if ( ! settingValue.hasOwnProperty( 'value' ) || ! settingValue.hasOwnProperty( 'label' ) ) {
			return accumulator;
		}

		const possibleNewLine = accumulator ? '\n' : '';

		if ( settingValue.value === settingValue.label ) {
			return accumulator + possibleNewLine + settingValue.label;
		}

		return accumulator + possibleNewLine + settingValue.value + TEXT_ARRAY_DELIMITER + settingValue.label;
	}, '' );
};

export default convertSettingsArrayToString;
