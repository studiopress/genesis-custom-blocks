/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FieldSettings } from './';
import { convertToSlug } from '../helpers';
import { useField } from '../hooks';

/**
 * @typedef {Object} FieldPanelProps The component props.
 * @property {string} selectedFieldName The name of the selected field.
 * @property {Function} setCurrentLocation Sets the current location, like 'editor'.
 */

/**
 * The field panel.
 *
 * @param {FieldPanelProps} props
 * @return {React.ReactElement} The field panel.
 */
const FieldPanel = ( { selectedFieldName, setCurrentLocation } ) => {
	const {
		controls,
		deleteField,
		getField,
		changeControl,
		changeFieldSettings,
	} = useField();

	const [ isAutoSluggingComplete, setIsAutoSluggingComplete ] = useState( false );
	const controlValues = Object.values( controls );
	const field = getField( selectedFieldName );

	/**
	 * Handles changing of the field label.
	 *
	 * @param {React.ChangeEvent} event The change event.
	 */
	const handleChangeLabel = ( event ) => {
		if ( ! event.target ) {
			return;
		}

		// @ts-ignore
		const { value } = event.target;
		const newField = { label: value };
		if ( ! isAutoSluggingComplete && value ) {
			newField.name = convertToSlug( value );
		}

		changeFieldSettings( selectedFieldName, newField );
	};

	return (
		<div className="p-4">
			{
				field && Object.keys( field ).length
					? <>
						<h4 className="text-sm font-semibold">{ __( 'Field Settings', 'genesis-custom-blocks' ) }</h4>
						<div className="mt-5">
							<label className="text-sm" htmlFor="field-label">{ __( 'Field Label', 'genesis-custom-blocks' ) }</label>
							<input
								className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
								type="text"
								id="field-label"
								value={ field.label }
								onFocus={ () => {
									if ( ! field.name ) {
										setIsAutoSluggingComplete( false );
									}
								} }
								onBlur={ () => setIsAutoSluggingComplete( true ) }
								onChange={ handleChangeLabel }
							/>
							<span className="block italic text-xs mt-1">{ __( 'A label or a title for this field.', 'genesis-custom-blocks' ) }</span>
						</div>
						<div className="mt-5">
							<label className="text-sm" htmlFor="field-name">{ __( 'Field Name (slug)', 'genesis-custom-blocks' ) }</label>
							<input
								className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm font-mono"
								type="text"
								id="field-name"
								value={ field.name }
								onChange={ ( event ) => {
									if ( event.target ) {
										changeFieldSettings( selectedFieldName, { name: event.target.value } );
									}
								} }
							/>
							<span className="block italic text-xs mt-1">{ __( 'Single word, no spaces.', 'genesis-custom-blocks' ) }</span>
						</div>
						<div className="mt-5">
							<label className="text-sm" htmlFor="field-control">{ __( 'Field ', 'genesis-custom-blocks' ) }</label>
							<select /* eslint-disable-line jsx-a11y/no-onchange */
								className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
								id="field-control"
								value={ field.control }
								onChange={ ( event ) => {
									if ( event.target ) {
										changeControl( selectedFieldName, event.target.value );
									}
								} }
							>
								{ controlValues.map( ( control, index ) => {
									return <option value={ control.name } key={ `control-option-${ index }` }>{ control.label }</option>;
								} ) }
							</select>
						</div>
						<FieldSettings
							field={ field }
							controls={ controls }
							changeFieldSettings={ changeFieldSettings }
							deleteField={ () => {
								deleteField( selectedFieldName );
							} }
							setCurrentLocation={ setCurrentLocation }
						/>
					</>
					: <span className="text-sm">
						{ __( 'No field selected', 'genesis-custom-blocks' ) }
					</span>
			}
		</div>
	);
};

export default FieldPanel;
