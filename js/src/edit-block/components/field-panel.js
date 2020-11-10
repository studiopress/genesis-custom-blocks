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
import { FieldSettings } from './';
import { useField } from '../hooks';

/**
 * The field panel.
 *
 * @return {React.ReactElement} The field panel component.
 */
const FieldPanel = () => {
	const { controls, field, changeControl, changeFieldSetting } = useField();

	const controlValues = Object.values( controls );
	return (
		<div className="p-4">
			<h4 className="text-sm font-semibold">{ __( 'Field Settings', 'genesis-custom-blocks' ) }</h4>
			<div className="mt-5">
				<label className="text-sm" htmlFor="field-label">{ __( 'Field Label', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					type="text"
					id="field-label"
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
				<label className="text-sm" htmlFor="field-name">{ __( 'Field Name (slug)', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm font-mono"
					type="text"
					id="field-name"
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
				<label className="text-sm" htmlFor="field-control">{ __( 'Field ', 'genesis-custom-blocks' ) }</label>
				<select /* eslint-disable-line jsx-a11y/no-onchange */
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					id="field-control"
					value={ field.control }
					onChange={ ( event ) => {
						if ( event.target ) {
							changeControl( event.target.value );
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
