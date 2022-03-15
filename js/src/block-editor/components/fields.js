/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { select } from '@wordpress/data';

/**
 * Gets the control function for the field.
 *
 * @param {Object} field The field to get the control function of.
 * @return {React.FunctionComponent} The control component.
 */
const getControl = ( field ) => {
	const loadedControls = applyFilters( 'genesisCustomBlocks.controls', {} );
	return loadedControls[ field.control ];
};

/**
 * Gets the class name for the field.
 *
 * @param {Object} field The field to get the class name of.
 * @return {string} The class name.
 */
const getClassName = ( field ) => {
	return field.width
		? `genesis-custom-blocks-control width-${ field.width }`
		: 'genesis-custom-blocks-control';
};

/**
 * @typedef {Object} FieldsProps The component props.
 * @property {Array}  fields           The fields to render.
 * @property {Object} parentBlock      The block where the fields are.
 * @property {Object} parentBlockProps The props to pass to the control function.
 * @property {number} [rowIndex]       The index of the repeater row, if this field is in one (optional).
 * @property {string} [context]        Where this will render, either in the GCB editor (edit-block) or the block editor.
 */

/**
 * Renders the fields, using their control functions.
 *
 * @param {FieldsProps} props The component props.
 * @return {React.ReactElement} The fields.
 */
const Fields = ( { fields, parentBlock, parentBlockProps, rowIndex, context } ) => (
	<>
		{
			fields.map( ( field ) => {
				if ( field.location && ! field.location.includes( 'editor' ) ) {
					return null; // This is not meant for the editor.
				}

				/**
				 * Handles a single control value changing.
				 *
				 * Changing a control value inside a block needs to be able to call
				 * the block's setAttributes property, so that the block can save the value.
				 * This function is passed to the control so that the control can save the value,
				 * depending on whether the control is in a repeater row or not.
				 * This gets the latest parentAttributes by using select( 'core/block-editor' ),
				 * as the parentBlockProps.attributes in the outer scope may be outdated.
				 *
				 * @param {*} newValue The new control value.
				 */
				const onChange = ( newValue ) => {
					const { clientId, setAttributes } = parentBlockProps;
					const parentAttributes = select( 'core/block-editor' ).getBlockAttributes( clientId );
					const attr = { ...parentAttributes };

					if ( undefined === rowIndex ) {
						// This is not in a repeater row.
						attr[ field.name ] = newValue;
						setAttributes( attr );
					} else {
						// This is in a repeater row.
						const attribute = attr[ field.parent ];
						const defaultRows = [ {} ];
						const rows = ( attribute && attribute.rows ) ? attribute.rows : defaultRows;

						if ( ! rows[ rowIndex ] ) {
							rows[ rowIndex ] = {};
						}
						rows[ rowIndex ][ field.name ] = newValue;
						attr[ field.parent ] = { rows };
						parentBlockProps.setAttributes( attr );
					}
				};

				/**
				 * Gets the value of the Control function, given its properties.
				 *
				 * If this is in a repeater row, the value is appropriate for that.
				 *
				 * @param {Object} props                  The properties of the Control function.
				 * @param {Object} props.field            The field.
				 * @param {Object} props.parentBlockProps The props of the parent block.
				 * @param {number} props.rowIndex         The index of the repeater row (optional).
				 */
				const getValue = ( {
					field: ownField,
					parentBlockProps: ownParentBlockProps,
					rowIndex: ownRowIndex,
				} ) => {
					const attr = { ...ownParentBlockProps.attributes };

					if ( ownField.parent && attr[ ownField.parent ] && attr[ ownField.parent ].rows ) {
						// The ownField is probably in a repeater row, as it has a parent.
						return attr[ ownField.parent ].rows[ ownRowIndex ][ ownField.name ];
					}
					// The ownField is not in a repeater row.
					return attr[ ownField.name ];
				};

				const Control = getControl( field );

				return Control
					? <div className={ getClassName( field ) } key={ `${ field.name }-control-${ rowIndex }` }>
						<Control
							field={ field }
							getValue={ getValue }
							onChange={ onChange }
							parentBlock={ parentBlock }
							rowIndex={ rowIndex }
							parentBlockProps={ parentBlockProps }
							context={ context }
						/>
					</div>
					: null;
			} )
		}
	</>
);

export default Fields;
