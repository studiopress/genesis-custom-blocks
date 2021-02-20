/**
 * Gets a snake_case string from a PascalCase one.
 *
 * @param {string} pascalCase A PascalCase string.
 * @return {string} A snake_case string.
 */
const pascalCaseToSnakeCase = ( pascalCase ) => {
	return pascalCase.replace(
		/([a-z])([A-Z1-9])/g,
		( match, p1, p2 ) => p1 + '_' + p2
	).toLowerCase();
};

export default pascalCaseToSnakeCase;
