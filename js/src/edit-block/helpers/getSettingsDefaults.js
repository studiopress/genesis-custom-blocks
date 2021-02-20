/**
 * @typedef {Object} Setting A field setting.
 * @see PHP class Genesis\CustomBlocks\Blocks\Controls\ControlSetting
 * @property {string} name Setting name (slug).
 * @property {string} label Setting label.
 * @property {string} type Setting type, not a data type like 'object'.
 * @property {*} default Setting default value.
 * @property {string} help Setting help text for the editor.
 * @property {*} sanitize To sanitize the setting value.
 * @property {*} validate To validate the value.
 * @property {*} value The current value.
 */

/**
 * Gets the settings defaults for a given control.
 *
 * Converts a snake_case settingType to a PascalCase,
 * then gets a field component of that name if it exists.
 * For example, passing 'number_non_negative' will return
 * a <NumberNonNegative> component.
 *
 * @param {string} controlName The name of the control, like 'text'.
 * @param {Object} controls The controls.
 * @return {Object} The settings defaults, or {} if there is no control for the passed name.
 */
const getSettingsDefaults = ( controlName, controls ) => {
	if ( ! controls[ controlName ] ) {
		return {};
	}

	return controls[ controlName ].settings.reduce(
		/**
		 * @param {Object} accumulator The reducer's accumulator.
		 * @param {Setting} setting The field setting.
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
