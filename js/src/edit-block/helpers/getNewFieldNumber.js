/**
 * Gets the new field nuber, if any.
 *
 * When new fields are added, if there is more than 1 field with
 * the name 'new-field', they have a number after.
 * Like 'new-field', 'new-field-1', 'new-field-2', etc...
 *
 * @param {Object} fields The existing fields.
 * @return {number|null} The new field number as a string, or null.
 */
const getNewFieldNumber = ( fields ) => {
	const numberOfFields = Object.values( fields ).length;
	if ( ! numberOfFields || ! fields.hasOwnProperty( 'new-field' ) ) {
		return null;
	}

	for ( let i = 1; i <= numberOfFields; i++ ) {
		if ( ! fields.hasOwnProperty( `new-field-${ i.toString() }` ) ) {
			return i;
		}
	}
};

export default getNewFieldNumber;
