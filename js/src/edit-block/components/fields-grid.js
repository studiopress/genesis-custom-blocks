/**
 * External dependencies
 */
import * as React from 'react';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Field } from './';
import { FIELD_PANEL } from '../constants';
import { useField } from '../hooks';

/**
 * @typedef {Object} FieldsGridProps The component props.
 * @property {import('./editor').CurrentLocation}                                      currentLocation    The currently selected location.
 * @property {import('./editor').SelectedField|import('../constants').NoFieldSelected} selectedField      The currenetly selected field.
 * @property {function(): void}                                                        createNewField     Sets if there is a new field.
 * @property {import('./editor').SetPanelDisplaying}                                   setPanelDisplaying Sets the current panel displaying.
 * @property {import('./editor').SetSelectedField}                                     setSelectedField   Sets the name of the selected field.
 * @property {string|null}                                                             [parentField]      The name of the parent field, if any.
 */

/**
 * The main grid of fields.
 *
 * @param {FieldsGridProps} props
 * @return {React.ReactElement} The fields displayed in a grid.
 */
const FieldsGrid = ( {
	currentLocation,
	selectedField,
	createNewField,
	setPanelDisplaying,
	setSelectedField,
	parentField = null,
} ) => {
	const { addNewField, getFieldsForLocation } = useField();
	const fields = useMemo(
		() => getFieldsForLocation( currentLocation, parentField ),
		[ currentLocation, getFieldsForLocation, parentField ]
	);

	return (
		<>
			<div
				role="grid"
				className={ classNames(
					'grid grid-cols-4 gap-4 w-full items-start',
					parentField ? 'mt-4' : 'mt-2'
				) }
			>
				{ fields && fields.length
					? fields.map( ( field, index ) => {
						const shouldDisplayMoveButtons = fields.length > 1;
						const isDownButtonDisabled = index >= ( fields.length - 1 );

						return (
							<Field
								key={ `grid-field-${ index }` }
								createNewField={ createNewField }
								currentLocation={ currentLocation }
								field={ field }
								index={ index }
								isDownButtonDisabled={ isDownButtonDisabled }
								selectedField={ selectedField }
								setPanelDisplaying={ setPanelDisplaying }
								setSelectedField={ setSelectedField }
								shouldDisplayMoveButtons={ shouldDisplayMoveButtons }
								parentField={ parentField }
							/>
						);
					} )
					: null
				}
			</div>
			<button
				className="flex items-center justify-center h-6 w-6 bg-black rounded-sm text-white mt-4 ml-auto"
				aria-label={ __( 'Add a new field', 'genesis-custom-blocks' ) }
				onClick={ ( event ) => {
					event.stopPropagation();
					const newFieldName = addNewField( currentLocation, parentField );
					const newSelectedField = { name: newFieldName };
					if ( null !== parentField ) {
						newSelectedField.parent = parentField;
					}

					setSelectedField( newSelectedField );
					setPanelDisplaying( FIELD_PANEL );
					createNewField();
				} }
			>
				<svg
					className="w-4 h-4 fill-current"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<title>{ __( 'New field', 'genesis-custom-blocks' ) }</title>
					<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
				</svg>
			</button>
		</>
	);
};

export default FieldsGrid;
