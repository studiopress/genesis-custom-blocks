/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getSettingsComponent } from '../helpers';
import { NO_FIELD_SELECTED } from '../constants';

/**
 * @callback onClickDelete Handler for deleting a field.
 * @callback onClickDuplicate Handler for duplicating a field.
 * @return {void}
 */

/**
 * @typedef {Object} FieldSettingsProps The component props.
 * @property {Object} controls All of the possible controls.
 * @property {onClickDelete} deleteField Deletes this field.
 * @property {onClickDuplicate} duplicateField Deletes this field.
 * @property {Object} field The current field.
 * @property {Function} changeFieldSettings Edits a given field's value.
 * @property {Function} setCurrentLocation Sets the current location, like 'editor'.
 * @property {Function} setSelectedField Sets the current location, like 'editor'.
 */

/**
 * The field settings.
 *
 * @param {FieldSettingsProps} props The component props.
 * @return {React.ReactElement} The field settings.
 */
const FieldSettings = ( {
	controls,
	changeFieldSettings,
	deleteField,
	duplicateField,
	field,
	setCurrentLocation,
	setSelectedField,
} ) => {
	const control = controls[ field.control ];

	return (
		<>
			{ control
				? control.settings.map( ( setting, index ) => {
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
										changeFieldSettings(
											field.name,
											{ [ setting.name ]: newSettingValue }
										);
									} }
									setCurrentLocation={ setCurrentLocation }
								/>
							</div>
						);
					}

					return null;
				} )
				: null
			}
			<div className="flex justify-between mt-5 border-t border-gray-300 pt-3">
				<button
					className="flex items-center bg-red-200 text-sm h-6 px-2 rounded-sm leading-none text-red-700 hover:bg-red-500 hover:text-red-100"
					onClick={ () => {
						deleteField();
						setSelectedField( NO_FIELD_SELECTED );
					} }
				>
					{ __( 'Delete', 'genesis-custom-blocks' ) }
				</button>
				<button
					className="flex items-center bg-blue-200 text-sm h-6 px-2 rounded-sm leading-none text-blue-700 hover:bg-blue-500 hover:text-blue-100"
					onClick={ duplicateField }
				>
					{ __( 'Duplicate', 'genesis-custom-blocks' ) }
				</button>
			</div>
		</>
	);
};

export default FieldSettings;
