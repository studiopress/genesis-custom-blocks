/**
 * External dependencies
 */
import * as React from 'react';
import className from 'classnames';

/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ClipboardCopy, FieldsGrid } from './';
import { FIELD_PANEL } from '../constants';
import { getFieldIcon, getWidthClass } from '../helpers';
import { useField } from '../hooks';

/**
 * @typedef {Object} FieldsGridProps The component props.
 * @property {import('./editor').CurrentLocation} currentLocation The currently selected location.
 * @property {import('./editor').Field} field The field to render.
 * @property {number} index The index in relation to other fields, starting with 0.
 * @property {boolean} isDownButtonDisabled Whether the down button is disabled.
 * @property {import('./editor').SelectedField|import('../constants').NoFieldSelected} selectedField The currenetly selected field.
 * @property {boolean} shouldDisplayMoveButtons Whether this should display the move buttons.
 * @property {import('./editor').SetIsNewField} setIsNewField Sets if there is a new field.
 * @property {import('./editor').SetPanelDisplaying} setPanelDisplaying Sets the current panel displaying.
 * @property {import('./editor').SetSelectedField} setSelectedField Sets the name of the selected field.
 * @property {string|null} [parentField] The name of the parent field, if any.
 */

/**
 * A single field in the grid.
 *
 * @param {FieldsGridProps} props
 * @return {React.ReactElement} The fields displayed in a grid.
 */
const Field = ( {
	currentLocation,
	field,
	index,
	isDownButtonDisabled,
	selectedField,
	shouldDisplayMoveButtons,
	setIsNewField,
	setPanelDisplaying,
	setSelectedField,
	parentField = null,
} ) => {
	const { reorderFields } = useField();
	const moveButtonClass = 'flex items-center justify-center text-sm w-6 h-5 hover:text-blue-700 z-10';
	const buttonDisabledClasses = 'opacity-50 cursor-not-allowed';

	const selectField = useCallback(
		/**
		 * Selects this field.
		 *
		 * @param {React.MouseEvent<HTMLDivElement>|React.KeyboardEvent<HTMLDivElement>} event The event to handle.
		 */
		( event ) => {
			event.stopPropagation();
			const newSelectedField = { name: field.name };
			if ( null !== parentField ) {
				newSelectedField.parent = parentField;
			}

			setSelectedField( newSelectedField );
			setPanelDisplaying( FIELD_PANEL );
		},
		[ field, parentField, setPanelDisplaying, setSelectedField ]
	);

	const isSelected = useMemo(
		/**
		 * Gets whether this field is selected.
		 *
		 * @return {boolean} Whether the field is selected.
		 */
		() => {
			if ( ! selectedField ) {
				return false;
			}
			if ( selectedField.hasOwnProperty( 'parent' ) || field.hasOwnProperty( 'parent' ) ) {
				return field.parent === selectedField.parent && field.name === selectedField.name;
			}
			return field.name === selectedField.name;
		},
		[ field, selectedField ]
	);
	const isUpButtonDisabled = 0 === index;
	const FieldIcon = getFieldIcon( field.control );

	return (
		<div
			role="row"
			className={ className(
				{ 'is-selected': isSelected },
				'field w-full',
				getWidthClass( field.width )
			) }
			key={ `field-item-${ index }` }
			tabIndex={ 0 }
			aria-label={ sprintf(
			/* translators: %1$s: the label of the field */
				__( 'Field: %1$s', 'genesis-custom-blocks' ),
				field.label
			) }
			onClick={ selectField }
			onKeyPress={ selectField }
		>
			<div
				role="gridcell"
				className="relative flex flex-col items-center w-full p-4 bg-white border border-gray-400 rounded-sm hover:border-black"
				id={ `field-item-${ index }` }
			>
				<div className="flex w-full items-center">
					<div>{ FieldIcon ? <FieldIcon /> : null }</div>
					<span className=" ml-4 truncate">{ field.label }</span>
					<div className="flex items-center h-6 px-2 bg-gray-200 rounded-sm ml-auto hover:bg-gray-300">
						<span className="text-xs font-mono mr-1">{ field.name }</span>
						<ClipboardCopy text={ field.name } />
					</div>
				</div>
				{ null === parentField && 'repeater' === field.control
					? (
						<FieldsGrid
							currentLocation={ currentLocation }
							parentField={ field.name }
							selectedField={ selectedField }
							setIsNewField={ setIsNewField }
							setPanelDisplaying={ setPanelDisplaying }
							setSelectedField={ setSelectedField }
						/>
					)
					: null
				}
				{ isSelected && shouldDisplayMoveButtons
					? <div className="flex absolute top-0 left-0 flex-col justify-between top-0 left-0 -ml-8 mt-0 rounded-sm bg-white border border-black">
						<button
							aria-label={ sprintf(
								/* translators: %1$s: the field label, %2$d: the current position, %3$d: its new position on moving */
								__( 'Move %1$s field up from position %2$d to position %3$d', 'genesis-custom-blocks' ),
								field.label,
								index,
								index - 1
							) }
							className={ className(
								moveButtonClass,
								{ [ buttonDisabledClasses ]: isUpButtonDisabled }
							) }
							onClick={ ( event ) => {
								event.preventDefault();
								reorderFields( index, index - 1, currentLocation, parentField );
							} }
							disabled={ isUpButtonDisabled }
						>
							<svg className="h-4 w-4 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
								<path d="M5 15l7-7 7 7" />
							</svg>
						</button>
						<button
							aria-label={ sprintf(
								/* translators: %1$s: the field label, %2$d: the current position, %3$d: its new position on moving */
								__( 'Move %1$s field down from position %2$d to position %3$d', 'genesis-custom-blocks' ),
								field.label,
								index,
								index + 1
							) }
							className={ className(
								moveButtonClass,
								{ [ buttonDisabledClasses ]: isDownButtonDisabled }
							) }
							onClick={ ( event ) => {
								event.preventDefault();
								reorderFields( index, index + 1, currentLocation, parentField );
							} }
							disabled={ isDownButtonDisabled }
						>
							<svg className="h-4 w-4 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
								<path d="M19 9l-7 7-7-7" />
							</svg>
						</button>
					</div>
					: null
				}
			</div>
		</div>
	);
};

export default Field;
