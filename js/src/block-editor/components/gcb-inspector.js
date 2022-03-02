/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { getFieldsAsArray } from '../../common/helpers';

/**
 * Gets the rendered controls for the Inspector Controls, based on the field values.
 *
 * @param {Object} props            This component's props.
 * @param {Object} props.blockProps The block's props.
 * @param {Object} props.block      The block.
 * @return {React.ReactElement} The inspector controls.
 */
const GcbInspector = ( { blockProps, block } ) => (
	<InspectorControls>
		{ getFieldsAsArray( block.fields ).map( ( field ) => {
			// If it's not meant for the inspector, continue (return null).
			if ( ! field.location || ! field.location.includes( 'inspector' ) ) {
				return null;
			}

			const loadedControls = applyFilters( 'genesisCustomBlocks.controls', {} );
			const Control = loadedControls[ field.control ];
			if ( ! Control ) {
				return null;
			}

			return (
				<PanelBody
					className="gcb-inspector-form"
					key={ `inspector-controls-panel-${ field.name }` }
				>
					<Control
						field={ field }
						getValue={ () => blockProps.attributes[ field.name ] }
						onChange={ ( newValue ) => {
							blockProps.setAttributes( {
								[ field.name ]: newValue,
							} );
						} }
						parentBlock={ block }
						parentBlockProps={ blockProps }
					/>
				</PanelBody>
			);
		} ) }
	</InspectorControls>
);

export default GcbInspector;
