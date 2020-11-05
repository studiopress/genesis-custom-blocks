/**
 * Internal dependencies
 */
import { TEXT_ARRAY_DELIMITER } from '../constants';

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

export default convertToString;
