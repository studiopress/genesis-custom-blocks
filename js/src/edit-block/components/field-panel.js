// @ts-check
/* global gcbEditor */

/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

/**
 * @typedef {Object} FieldPanelProps The component props.
 * @property {Object} block The block config.
 */

/**
 * The field settings.
 *
 * @param {FieldPanelProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const FieldPanel = ( { block } ) => {
	// @ts-ignore
	const controls = Object.values( gcbEditor.controls );
	// Todo: When the main editor area exists, change this to be the field that's selected.
	const field = Object.values( block.fields )[ 0 ];

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
				/>
				<span className="block italic text-xs mt-1">{ __( 'Single word, no spaces.', 'genesis-custom-blocks' ) }</span>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-3">{ __( 'Field ', 'genesis-custom-blocks' ) }</label>
				<select className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" name="" id="setting-3">
					{ controls.map( ( control, index ) => {
						return <option value={ control.name } key={ `control-option-${ index }` }>{ control.label }</option>;
					} ) }
				</select>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-4">{ __( 'Field Width', 'genesis-custom-blocks' ) }</label>
				<div className="flex w-full border border-gray-600 rounded-sm mt-2">
					<button className="w-0 flex-grow h-8 rounded-sm text-sm focus:outline-none" id="setting-4">25%</button>
					<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">50%</button>
					<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">75%</button>
					<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">100%</button>
				</div>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-5">{ __( 'Help Text', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					type="text"
					id="setting-5"
					value={ field.help }
				/>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-6">{ __( 'Default Value', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					type="text"
					id="setting-6"
					value={ field.default }
				/>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-7">{ __( 'Placeholder Text', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
					type="text"
					id="setting-7"
					value={ field.placeholder }
				/>
			</div>
			<div className="mt-5">
				<label className="text-sm" htmlFor="setting-8">{ __( 'Character Limit', 'genesis-custom-blocks' ) }</label>
				<input
					className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" type="number" id="setting-8" />
			</div>
			<div className="flex justify-between mt-5 border-t border-gray-300 pt-3">
				<button className="flex items-center bg-red-200 text-sm h-6 px-2 rounded-sm leading-none text-red-700 hover:bg-red-500 hover:text-red-100">{ __( 'Delete', 'genesis-custom-blocks' ) }</button>
				<button className="flex items-center bg-blue-200 text-sm h-6 px-2 rounded-sm leading-none text-blue-700 hover:bg-blue-500 hover:text-blue-100">{ __( 'Duplicate', 'genesis-custom-blocks' ) }</button>
			</div>
		</div>
	);
};

export default withSelect( ( select ) => {
	const { getEditedPostContent } = select( 'core/editor' );

	let parsedContent;
	try {
		parsedContent = JSON.parse( getEditedPostContent() );
	} catch ( error ) {
		parsedContent = {};
	}

	return { block: Object.values( parsedContent )[ 0 ] };
} )( FieldPanel );
