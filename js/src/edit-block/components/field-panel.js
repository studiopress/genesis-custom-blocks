/* global gcbEditor */

/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { FieldSettings } from './';

/**
 * The field panel.
 *
 * @return {React.ReactElement} The field panel component.
 */
const FieldPanel = () => {
	// @ts-ignore
	const { controls } = gcbEditor;
	const editedPostContent = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostContent(),
		[]
	);

	const getFullBlock = useCallback( () => {
		try {
			return JSON.parse( editedPostContent );
		} catch ( error ) {
			return {};
		}
	}, [ editedPostContent ] );

	const fullBlock = getFullBlock();
	const { editPost } = useDispatch( 'core/editor' );
	const blockNameWithNamespace = Object.keys( fullBlock )[ 0 ];

	/**
	 * Changes the control of a field.
	 *
	 * @param {string} fieldName The name (slug) of the field.
	 * @param {string} newControlName The name of the control to change to.
	 */
	const changeControl = useCallback( ( fieldName, newControlName ) => {
		const newControl = controls[ newControlName ];
		if ( ! newControl ) {
			return;
		}

		if ( ! fullBlock[ blockNameWithNamespace ].fields ) {
			fullBlock[ blockNameWithNamespace ].fields = [];
		}

		// Todo: handle multiple fields when it's possible to add a field.
		const previousField = fullBlock[ blockNameWithNamespace ].fields[ fieldName ];
		const newField = {
			name: previousField.name,
			label: previousField.label,
			control: newControl.name,
			type: newControl.type,
		};

		fullBlock[ blockNameWithNamespace ].fields[ fieldName ] = newField;
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNamespace, controls, editPost, fullBlock ] );

	const block = fullBlock[ blockNameWithNamespace ];

	// Todo: When the main editor area exists, change this to be the field that's selected.
	// Also, when a new block is created, populate a first field.
	const fieldName = Object.keys( block.fields )[ 0 ];
	const field = block.fields[ fieldName ];
	const controlValues = Object.values( controls );

	/**
	 * Changes the control of a field.
	 *
	 * @param {string} settingKey The key of the setting, like 'label' or 'placeholder'.
	 * @param {any} newSettingValue The new setting value.
	 */
	const changeFieldSetting = useCallback( ( settingKey, newSettingValue ) => {
		fullBlock[ blockNameWithNamespace ].fields[ fieldName ][ settingKey ] = newSettingValue;
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNamespace, editPost, fieldName, fullBlock ] );

	return (
		<div className="p-4">
			<h4 className="text-sm font-semibold">{ __( 'Field Settings', 'genesis-custom-blocks' ) }</h4>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-1">{ __( 'Field Label', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					type="text"
					id="setting-1"
					value={ field.label }
					onChange={ ( event ) => {
						if ( event.target ) {
							changeFieldSetting( 'label', event.target.value );
						}
					} }
				/>
				<span className="block italic text-xs mt-1">{ __( 'A label or a title for this field.', 'genesis-custom-blocks' ) }</span>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-2">{ __( 'Field Name (slug)', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm font-mono"
					type="text"
					id="setting-2"
					value={ field.name }
					onChange={ ( event ) => {
						if ( event.target ) {
							changeFieldSetting( 'name', event.target.value );
						}
					} }
				/>
				<span className="block italic text-xs mt-1">{ __( 'Single word, no spaces.', 'genesis-custom-blocks' ) }</span>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-3">{ __( 'Field ', 'genesis-custom-blocks' ) }</label>
				<select /* eslint-disable-line jsx-a11y/no-onchange */
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					value={ field.control }
					onChange={ ( event ) => {
						if ( event.target ) {
							changeControl( fieldName, event.target.value );
						}
					} }
				>
					{ controlValues.map( ( control, index ) => {
						return <option value={ control.name } key={ `control-option-${ index }` }>{ control.label }</option>;
					} ) }
				</select>
			</div>
			<FieldSettings field={ field } controls={ controls } changeFieldSetting={ changeFieldSetting } />
		</div>
	);
};

export default FieldPanel;
