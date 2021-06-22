/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FieldSettings } from './';
import { NO_FIELD_SELECTED } from '../constants';
import { convertToSlug } from '../helpers';
import { useField } from '../hooks';

/**
 * @typedef {Object} FieldPanelProps The component props.
 * @property {import('./editor').CurrentLocation} currentLocation The currently selected location.
 * @property {import('./editor').IsNewField} isNewField Whether there is a new field.
 * @property {import('./editor').SelectedField|import('../constants').NoFieldSelected} selectedField The name of the selected field, if any.
 * @property {import('./editor').SetCurrentLocation} setCurrentLocation Sets the current location, like 'editor'.
 * @property {import('./editor').SetIsNewField} setIsNewField Sets whether there is a new field.
 * @property {import('./editor').SetSelectedField} setSelectedField Sets the currently selected field name.
 */

/**
 * The field panel.
 *
 * @param {FieldPanelProps} props
 * @return {React.ReactElement} The field panel.
 */
const FieldPanel = ( {
	currentLocation,
	isNewField,
	selectedField,
	setCurrentLocation,
	setIsNewField,
	setSelectedField,
} ) => {
	const {
		changeControl,
		changeFieldSettings,
		controls,
		deleteField,
		duplicateField,
		getField,
		getFields,
	} = useField();
	const ref = useRef();
	const didAutoSlug = useRef( false );

	useEffect( () => {
		if ( isNewField && ref.current ) {
			const { ownerDocument: { activeElement } } = ref.current;
			if ( ! activeElement || ref.current !== activeElement ) {
				// @ts-ignore
				ref.current.select();
			}

			didAutoSlug.current = false;
		}
	}, [ didAutoSlug, isNewField ] );

	/**
	 * Whether the block has at least one field with the control of 'inner_blocks'
	 *
	 * @return {boolean} Whether the block has an 'inner_blocks' field.
	 */
	const hasInnerBlocks = () => {
		return getFields().some( ( field ) => 'inner_blocks' === field.control );
	};

	const field = getField( selectedField );

	/**
	 * Gets the control values, possibly excluding based on the selected field or the location.
	 *
	 * @return {Object[]} The control values.
	 */
	const getControlValues = () => {
		return Object.values( controls ).filter( ( control ) => {
			if ( selectedField && selectedField.hasOwnProperty( 'parent' ) ) {
				return 'repeater' !== control.name; // Don't allow repeaters inside repeaters.
			}

			if ( control.name === 'inner_blocks' && field.control !== 'inner_blocks' && hasInnerBlocks() ) {
				return false;
			}

			return ! currentLocation || control.locations.hasOwnProperty( currentLocation );
		} );
	};

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
								if ( ! event.target ) {
									return;
								}

								const changedField = { label: event.target.value };
								const fieldToChange = { name: field.name };
								if ( field.hasOwnProperty( 'parent' ) ) {
									fieldToChange.parent = field.parent;
								}

								if ( isNewField ) {
									didAutoSlug.current = true;
									const newName = convertToSlug( event.target.value );
									const newDeDuplicatedName = changeFieldSettings( fieldToChange, { ...changedField, name: newName } );

									setSelectedField( {
										...fieldToChange,
										name: newDeDuplicatedName,
									} );
								} else {
									changeFieldSettings( fieldToChange, changedField );
								}
							} }
							onBlur={ () => {
								if ( didAutoSlug.current ) {
									setIsNewField( false );
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
									const changedName = event.target.value;
									const deDuplicatedName = changeFieldSettings( selectedField, { name: changedName } );

									const newSelectedField = { name: deDuplicatedName };
									if ( selectedField.hasOwnProperty( 'parent' ) ) {
										newSelectedField.parent = selectedField.parent;
									}
									setSelectedField( newSelectedField );
								}
							} }
						/>
						<span className="block italic text-xs mt-1">{ __( 'Single word, no spaces.', 'genesis-custom-blocks' ) }</span>
					</div>
					<div className="mt-5">
						<label className="text-sm" htmlFor="field-control">{ __( 'Field Type', 'genesis-custom-blocks' ) }</label>
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
							{ getControlValues().map( ( control, index ) => {
								return <option value={ control.name } key={ `control-option-${ index }` }>{ control.label }</option>;
							} ) }
						</select>
					</div>
					<FieldSettings
						controls={ controls }
						changeFieldSettings={ changeFieldSettings }
						deleteField={ () => deleteField( selectedField ) }
						duplicateField={ () => duplicateField( selectedField ) }
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
