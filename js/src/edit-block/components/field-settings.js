/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import * as settingsComponents from './settings';

/**
 * @typedef {Object} FieldSettingsProps The component props.
 * @property {Object} controls All of the possible controls.
 * @property {Object} field The current field.
 * @property {Function} editField Edits a given field's value.
 */

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
	let componentName;

	if ( 1 === splitSettingType.length ) {
		componentName = capitalize( settingType );
	} else {
		componentName = splitSettingType.reduce( ( accumulator, currentValue ) => {
			return capitalize( accumulator ) + capitalize( currentValue );
		} );
	}

	return settingsComponents[ componentName ] ? settingsComponents[ componentName ] : null; /* eslint-disable-line import/namespace */
};

/**
 * The field settings.
 *
 * @param {FieldSettingsProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const FieldSettings = ( { controls, editField, field } ) => {
	const control = controls[ field.control ];

	return (
		<>
			{
				control.settings.map( ( setting, index ) => {
					const SettingComponent = getSettingsComponent( setting.type );
					const key = `field-setting-${ index }`;
					const value = null === field[ setting.name ] ? setting.default : field[ setting.name ];

					if ( SettingComponent ) {
						return (
							<div className="mt-5" key={ key }>
								<SettingComponent
									setting={ setting }
									value={ value }
									handleOnChange={ ( newSettingValue ) => {
										editField( field.name, setting.name, newSettingValue );
									} }
								/>
							</div>
						);
					}

					return null;
				} )
			}
			<div className="flex justify-between mt-5 border-t border-gray-300 pt-3">
				<button className="flex items-center bg-red-200 text-sm h-6 px-2 rounded-sm leading-none text-red-700 hover:bg-red-500 hover:text-red-100">
					{ __( 'Delete', 'genesis-custom-blocks' ) }
				</button>
				<button className="flex items-center bg-blue-200 text-sm h-6 px-2 rounded-sm leading-none text-blue-700 hover:bg-blue-500 hover:text-blue-100">
					{ __( 'Duplicate', 'genesis-custom-blocks' ) }
				</button>
			</div>
		</>
	);
};

export default FieldSettings;
