/**
 * Gets the settings defaults for a given control.
 *
 * Converts a snake_case settingType to a PascalCase,
 * then gets a field component of that name if it exists.
 * For example, passing 'number_non_negative' will return
 * a <NumberNonNegative> component.
 *
 * @param {string} controlName The name of the control, like 'text'.
 * @param {Object} controls    The controls.
 * @return {Object} The settings defaults, or {} if there is no control for the passed name.
 */
const getSettingsDefaults = ( controlName, controls ) => {
	if ( ! controls[ controlName ] ) {
		return {};
	}

	return controls[ controlName ].settings.reduce(
		/**
		 * @param {Object}                                 accumulator The reducer's accumulator.
		 * @param {import('../components/editor').Setting} setting     The field setting.
		 * @return {Object} Key/value pairs of a setting name to its default value.
		 */
		( accumulator, setting ) => ( {
			...accumulator,
			[ setting.name ]: setting.default,
		} ),
		{}
	);
};

export default getSettingsDefaults;
