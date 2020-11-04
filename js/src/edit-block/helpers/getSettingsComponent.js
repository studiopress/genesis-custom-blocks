/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import * as settingsComponents from '../components/settings';

/**
 * Capitalizes a name.
 *
 * @param {string} name The name to capitalize.
 */
const capitalize = ( name ) => name.charAt( 0 ).toUpperCase() + name.slice( 1 );

/**
 * @typedef {Object} SettingsComponentProps The component props.
 * @property {Function} handleOnChange Handles a change in this setting.
 * @property {Object} setting This setting.
 * @property {boolean|undefined} value The setting value.
 */

/**
 * Gets the settings component if there is one.
 *
 * Converts a snake_case argument to a PascalCase.
 * For example, passing 'number_non_negative' to this will return
 * a <NumberNonNegative> component.
 *
 * @param {string} settingType The type of setting, like 'text'
 * @return {React.ComponentType<SettingsComponentProps>} The settings component, if it exists.
 */
const getSettingsComponent = ( settingType ) => {
	const splitSettingType = settingType.split( '_' );

	const componentName = splitSettingType.reduce( ( accumulator, currentValue ) => {
		return capitalize( accumulator ) + capitalize( currentValue );
	}, '' );

	const filteredComponents = applyFilters( 'genesisCustomBlocks.settingsComponents', settingsComponents );
	return filteredComponents[ componentName ] ? filteredComponents[ componentName ] : null; /* eslint-disable-line import/namespace */
};

export default getSettingsComponent;
