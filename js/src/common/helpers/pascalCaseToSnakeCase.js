/**
 * Gets a PascalCase string from a snake_case one.
 *
 * @param {string} pascalCase A snake_case string.
 * @return {string} A PascalCase string.
 */
const pascalCaseToSnakeCase = ( pascalCase ) => {
	return pascalCase.replace(
		/(?<=[a-z])[A-Z1-9]/g,
		( match ) => '_' + match
	).toLowerCase();
};

export default pascalCaseToSnakeCase;
