/**
 * Gets a snake_case string from a PascalCase one.
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
