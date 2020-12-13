/**
 * Gets the new field number, if any.
 *
 * When new fields are added, if there is more than 1 field with
 * the name 'new-field', they have a number after.
 * Like 'new-field', 'new-field-1', 'new-field-2', etc...
 *
 * @param {Object} fields    The existing fields.
 * @param {string} fieldName The field name.
 * @return {number|null} The new field number as a string, or null.
 */
const getNewFieldNumber = ( fields, fieldName = 'new-field' ) => {
	const fieldKeys = Object.keys( fields );
	if ( ! fieldKeys.length || ! fieldKeys.includes( fieldName ) ) {
		return null;
	}

	for ( let i = 1; i <= fieldKeys.length; i++ ) {
		if ( ! fieldKeys.includes( `${ fieldName }-${ i.toString() }` ) ) {
			return i;
		}
	}
};

export default getNewFieldNumber;
