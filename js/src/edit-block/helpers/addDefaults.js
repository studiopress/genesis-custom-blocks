/**
 * Add defaults to an object when properties don't exist.
 *
 * @param {Object} initial The object to substitute defaults in.
 * @param {Object} defaults The defaults for the object.
 * @return {Object} The object with defaults when properties don't exist.
 */
const addDefaults = ( initial, defaults ) => {
	const defaultsToAdd = Object.keys( defaults ).reduce( ( accumulator, currentKey ) => {
		if ( ! initial.hasOwnProperty( currentKey ) ) {
			return {
				...accumulator,
				[ currentKey ]: defaults[ currentKey ],
			};
		}

		return accumulator;
	}, {} );

	return {
		...initial,
		...defaultsToAdd,
	};
};

export default addDefaults;
