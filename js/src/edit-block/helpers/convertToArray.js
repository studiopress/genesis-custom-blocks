/**
 * Internal dependencies
 */
import { TEXT_ARRAY_DELIMITER } from '../constants';

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

export default convertToArray;
