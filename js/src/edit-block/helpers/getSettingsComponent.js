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
import { snakeCaseToPascalCase } from '../../common/helpers';

/**
 * @typedef {Object} SettingsComponentProps The component props.
 * @property {Function} handleOnChange Handles a change in this setting.
 * @property {Object} setting This setting.
 * @property {boolean|undefined} value The setting value.
 */

/**
 * Gets the settings component if there is one.
 *
 * Converts a snake_case settingType to a PascalCase,
 * then gets a field component of that name if it exists.
 * For example, passing 'number_non_negative' will return
 * a <NumberNonNegative> component.
 *
 * @param {string} settingType The type of setting, like 'text'
 * @return {React.FunctionComponent<SettingsComponentProps>} The settings component, if it exists.
 */
const getSettingsComponent = ( settingType ) => {
	if ( ! settingType || 'string' !== typeof settingType ) {
		return null;
	}

	const componentName = snakeCaseToPascalCase( settingType );

	const filteredComponents = applyFilters( 'genesisCustomBlocks.settingsComponents', settingsComponents );
	return filteredComponents[ componentName ] ? filteredComponents[ componentName ] : null; /* eslint-disable-line import/namespace */
};

export default getSettingsComponent;
