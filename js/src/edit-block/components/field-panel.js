/* global gcbEditor */

/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect, useSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { FieldSettings } from './';

// @ts-ignore
const { controls } = gcbEditor;

/**
 * @typedef {Object} FieldPanelProps The component props.
 * @property {Object} block The block config.
 * @property {Function} changeControl Change the control.
 * @property {Function} changeFieldSetting Edits a field value.
 */

/**
 * The field settings.
 *
 * @param {FieldPanelProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const FieldPanel = ( { block, changeControl, changeFieldSetting } ) => {
	// @ts-ignore
	const { controls } = gcbEditor;
	const controlValues = Object.values( controls );

	// Todo: When the main editor area exists, change this to be the field that's selected.
	const fieldName = Object.keys( block.fields )[ 0 ];
	const field = block.fields[ fieldName ];

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
							changeFieldSetting( fieldName, 'label', event.target.value );
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
							changeFieldSetting( fieldName, 'name', event.target.value );
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

export default compose( [
	withSelect( ( select ) => {
		const { getEditedPostContent } = select( 'core/editor' );

		let parsedContent;
		try {
			parsedContent = JSON.parse( getEditedPostContent() );
		} catch ( error ) {
			parsedContent = {};
		}

		return {
			block: Object.values( parsedContent )[ 0 ],
			fullBlock: parsedContent,
		};
	} ),
	withDispatch( ( dispatch, { fullBlock } ) => {
		const { editPost } = dispatch( 'core/editor' );
		const blockNameWithNamespace = Object.keys( fullBlock )[ 0 ];

		return {
			/**
			 * Changes the control of a field.
			 *
			 * @param {string} fieldName The name (slug) of the field.
			 * @param {string} settingKey The key of the setting, like 'label' or 'placeholder'. 
			 * @param {any} newSettingValue The new setting value.
			 */
			changeFieldSetting: ( fieldName, settingKey, newSettingValue ) => {
				fullBlock[ blockNameWithNamespace ].fields[ fieldName ][ settingKey ] = newSettingValue;
				editPost( { content: JSON.stringify( fullBlock ) } );
			},

			/**
			 * Changes the control of a field.
			 *
			 * @param {string} fieldName The name (slug) of the field.
			 * @param {string} newControlName The name of the control to change to.
			 */
			changeControl: ( fieldName, newControlName ) => {
				const control = controls[ newControlName ];
				if ( ! control ) {
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
					control: control.name,
					type: control.type,
				}

				fullBlock[ blockNameWithNamespace ].fields[ fieldName ] = newField;
				editPost( { content: JSON.stringify( fullBlock ) } );
			},
		};
	} ),
] )( FieldPanel );
