/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { FieldSettings } from './';
import { NO_FIELD_SELECTED, NO_NEW_FIELD } from '../constants';
import { useField } from '../hooks';

/**
 * @typedef {Object} FieldPanelProps The component props.
 * @property {string|null} newField The new field name, or null if there is none.
 * @property {string|null} selectedField The name of the selected field.
 * @property {Function} setCurrentLocation Sets the current location, like 'editor'.
 * @property {Function} setNewField Sets the current new field, if any.
 * @property {Function} setSelectedField Sets the currently selected field name.
 */

/**
 * The field panel.
 *
 * @param {FieldPanelProps} props
 * @return {React.ReactElement} The field panel.
 */
const FieldPanel = ( {
	newField,
	selectedField,
	setCurrentLocation,
	setNewField,
	setSelectedField,
} ) => {
	const {
		changeControl,
		changeFieldSettings,
		controls,
		deleteField,
		getField,
	} = useField();

	const controlValues = Object.values( controls );
	const field = getField( selectedField );
	const isNewField = useMemo(
		() => newField && field && newField === field.name,
		[ field, newField ]
	);

	const ref = useRef();

	useEffect( () => {
		if ( isNewField && ref.current ) {
			//@ts-ignore
			ref.current.select();
		}
	}, [ field, isNewField ] );

	return (
		<div className="p-4">
			{ NO_FIELD_SELECTED === selectedField
				? <span className="text-sm">
					{ __( 'No field selected', 'genesis-custom-blocks' ) }
				</span>
				: <>
					<h4 className="text-sm font-semibold">{ __( 'Field Settings', 'genesis-custom-blocks' ) }</h4>
					<div className="mt-5">
						<label className="text-sm" htmlFor="field-label">{ __( 'Field Label', 'genesis-custom-blocks' ) }</label>
						<input
							className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
							type="text"
							id="field-label"
							value={ field.label }
							ref={ ref }
							onChange={ ( event ) => {
								if ( event.target ) {
									changeFieldSettings( selectedField, { label: event.target.value } );
									setNewField( NO_NEW_FIELD );
								}
							} }
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
									changeFieldSettings( selectedField, { name: event.target.value } );
									setSelectedField( event.target.value );
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
									changeControl( selectedField, event.target.value );
								}
							} }
						>
							{ controlValues.map( ( control, index ) => {
								return <option value={ control.name } key={ `control-option-${ index }` }>{ control.label }</option>;
							} ) }
						</select>
					</div>
					<FieldSettings
						controls={ controls }
						changeFieldSettings={ changeFieldSettings }
						deleteField={ () => deleteField( selectedField ) }
						field={ field }
						setCurrentLocation={ setCurrentLocation }
						setSelectedField={ setSelectedField }
					/>
				</>
			}
		</div>
	);
};

export default FieldPanel;
