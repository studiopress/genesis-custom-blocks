/**
 * Internal dependencies
 */
import { TEXT_ARRAY_DELIMITER } from '../constants';

/**
 * Converts the settings to an array.
 *
 * @param {string} settings The settings values.
 * @return {Array} The setting converted to a string.
 */
const convertSettingsStringToArray = ( settings ) => {
	return settings
		.split( /\r\n|[\r\n]/ )
		.reduce( ( accumulator, option ) => {
			const splitOption = option.split( TEXT_ARRAY_DELIMITER );

			// If the line doesn't have a :
			if ( 1 === splitOption.length ) {
				return [
					...accumulator,
					{
						value: option,
						label: option,
					},
				];
			}

			return [
				...accumulator,
				{
					value: splitOption[ 0 ],
					label: splitOption[ 1 ],
				},
			];
		}, [] );
};

export default convertSettingsStringToArray;
