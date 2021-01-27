/**
 * Ensures the order property is sequential for the fields.
 *
 * For example, the first field object should have an order property of 0,
 * the next should have 1, etc...
 * This is useful after reordering fields or adding a new one.
 *
 * @param {Object[]} initialFields The fields to set the order of.
 * @return {Object[]} The fields with correct order properties.
 */
const setCorrectOrderForFields = ( initialFields ) => {
	return initialFields.reduce( ( accumulator, field, index ) => {
		return [
			...accumulator,
			{
				...field,
				order: index,
			},
		];
	}, [] );
};

export default setCorrectOrderForFields;
