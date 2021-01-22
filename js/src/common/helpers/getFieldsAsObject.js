/**
 * Gets the fields as an object of objects, with an 'order' property.
 *
 * @param {Array} fieldsArray The fields as an array.
 * @return {Object} The fields as an object, with an 'order' property.
 */
const getFieldsAsObject = ( fieldsArray ) => {
	return fieldsArray.reduce( ( accumulator, field, index ) => {
		accumulator[ field.name ] = {
			...field,
			order: index,
		};

		return accumulator;
	}, {} );
};

export default getFieldsAsObject;
