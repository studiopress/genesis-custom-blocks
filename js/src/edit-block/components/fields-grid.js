/**
 * External dependencies
 */
import * as React from 'react';
import className from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ClipboardCopy } from './';
import { ALTERNATE_LOCATION, DEFAULT_LOCATION, FIELD_PANEL } from '../constants';
import { useField } from '../hooks';
import { getFieldIcon, getWidthClass } from '../helpers';

/**
 * @typedef {Object} FieldsGridProps The component props.
 * @property {string} currentLocation The currently selected location.
 * @property {string|null} selectedField The currenetly selected field.
 * @property {Function} setCurrentLocation Sets the currently selected location.
 * @property {Function} setIsNewField Sets if there is a new field.
 * @property {Function} setPanelDisplaying Sets the current panel displaying.
 * @property {Function} setSelectedField Sets the name of the selected field.
 */

/**
 * @typedef {Object} Field A block field.
 * @property {string} name The name of the field.
 * @property {string} control The control, like 'text'.
 * @property {string|number} width The width, like '25'.
 * @property {string} label The label of the field.
 */

/**
 * The main grid of fields.
 *
 * @param {FieldsGridProps} props
 * @return {React.ReactElement} The main editing area.
 */
const FieldsGrid = ( {
	currentLocation,
	selectedField,
	setCurrentLocation,
	setIsNewField,
	setPanelDisplaying,
	setSelectedField,
} ) => {
	const { addNewField, getFieldsForLocation, reorderFields } = useField();
	const fields = getFieldsForLocation( currentLocation );
	const locationButtonClass = 'h-12 px-4 text-sm focus:outline-none';
	const moveButtonClass = 'flex items-center justify-center text-sm w-6 h-5 hover:text-blue-700 z-10';
	const buttonDisabledClasses = 'opacity-50 cursor-not-allowed';

	return (
		<>
			<div className="flex mt-6">
				<button
					className={ locationButtonClass }
					onClick={ () => setCurrentLocation( DEFAULT_LOCATION ) }
				>
					<span
						className={ className( {
							'font-semibold': DEFAULT_LOCATION === currentLocation,
						} ) }
					>
						{ __( 'Editor Fields', 'genesis-custom-blocks' ) }
					</span>
				</button>
				<button
					className={ locationButtonClass }
					onClick={ () => setCurrentLocation( ALTERNATE_LOCATION ) }
				>
					<span
						className={ className( {
							'font-semibold': ALTERNATE_LOCATION === currentLocation,
						} ) }
					>
						{ __( 'Inspector Fields', 'genesis-custom-blocks' ) }
					</span>
				</button>
			</div>
			<div
				role="grid"
				className="grid grid-cols-4 gap-4 w-full items-start mt-2"
			>
				{
					/**
					 * @param {Field[]} field
					 * @param {number} index
					 */
					fields && fields.length
						? fields.map( ( field, index ) => {
							const selectField = () => {
								setSelectedField( field.name );
								setPanelDisplaying( FIELD_PANEL );
							};
							const shouldDisplayMoveButtons = fields.length > 1;
							const isUpButtonDisabled = 0 === index;
							const isDownButtonDisabled = index >= ( fields.length - 1 );
							const isSelected = field.name === selectedField;
							const FieldIcon = getFieldIcon( field.control );

							return (
								<div
									className={ className(
										{ 'is-selected': isSelected },
										'field w-full',
										getWidthClass( field.width )
									) }
									key={ `field-item-${ index }` }
									role="gridcell"
									tabIndex={ 0 }
									aria-label={ sprintf(
										// translators: %s: the label of the field
										__( 'Field: %s', 'genesis-custom-blocks' ),
										field.label
									) }
									onClick={ selectField }
									onKeyPress={ selectField }
								>
									<div
										className="relative flex items-center w-full p-4 bg-white border border-gray-400 rounded-sm hover:border-black"
										id={ `field-item-${ index }` }
									>
										<div>{ FieldIcon ? <FieldIcon /> : null }</div>
										<span className=" ml-4 truncate">{ field.label }</span>
										<div className="flex items-center h-6 px-2 bg-gray-200 rounded-sm ml-auto hover:bg-gray-400">
											<span className="text-xs font-mono">{ field.name }</span>
											<ClipboardCopy text={ field.name } />
										</div>
										{ shouldDisplayMoveButtons
											? (
												<div
													className={ className(
														isSelected ? 'flex' : 'hidden',
														'absolute top-0 left-0 flex-col justify-between top-0 left-0 -ml-8 mt-0 rounded-sm bg-white border border-black'
													) }
												>
													<button
														aria-describedby={ `move-up-button-${ index }` }
														className={ className(
															moveButtonClass,
															{ [ buttonDisabledClasses ]: isUpButtonDisabled }
														) }
														onClick={ ( event ) => {
															event.preventDefault();
															reorderFields( index, index - 1, currentLocation );
														} }
														disabled={ isUpButtonDisabled }
													>
														<svg className="h-4 w-4 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
															<path d="M5 15l7-7 7 7" />
														</svg>
													</button>
													<span id={ `move-up-button-${ index }` } className="hidden">
														{ sprintf(
															/* translators: %1$s: the field label, %2$d: the current position, %3$d: its new position on moving */
															__( 'Move %1$s field up from position %2$d to position %3$d', 'genesis-custom-blocks' ),
															field.label,
															index,
															index - 1
														) }
													</span>
													<button
														aria-describedby={ `move-down-button-${ index }` }
														className={ className(
															moveButtonClass,
															{ [ buttonDisabledClasses ]: isDownButtonDisabled }
														) }
														onClick={ ( event ) => {
															event.preventDefault();
															reorderFields( index, index + 1, currentLocation );
														} }
														disabled={ isDownButtonDisabled }
													>
														<svg className="h-4 w-4 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
															<path d="M19 9l-7 7-7-7" />
														</svg>
													</button>
													<span id={ `move-down-button-${ index }` } className="hidden">
														{ sprintf(
															/* translators: %1$s: the field label, %2$d: the current position, %3$d: its new position on moving */
															__( 'Move %1$s field down from position %2$d to position %3$d', 'genesis-custom-blocks' ),
															field.label,
															index,
															index + 1
														) }
													</span>
												</div>
											)
											: null
										}
									</div>
								</div>
							);
						} )
						: null
				}
			</div>
			<button
				className="flex items-center justify-center h-6 w-6 bg-black rounded-sm text-white mt-4 ml-auto"
				onClick={ () => {
					const newFieldName = addNewField( currentLocation );
					setSelectedField( newFieldName );
					setIsNewField( true );
					setPanelDisplaying( FIELD_PANEL );
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
