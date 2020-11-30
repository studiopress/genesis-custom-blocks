/**
 * External dependencies
 */
import * as React from 'react';
import className from 'classnames';

/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ClipboardCopy } from './';
import { useBlock } from '../hooks';
import { ALTERNATE_LOCATION, DEFAULT_LOCATION } from '../constants';
import { getNewFieldNumber, getOtherLocation, getWidthClass } from '../helpers';
import { getFieldsAsArray, getFieldsAsObject } from '../../common/helpers';

/**
 * @typedef {Object} FieldsGridProps The component props.
 * @property {string} selectedFieldName The currenetly selected field.
 * @property {Function} setSelectedFieldName Sets the name of the selected field.
 */

/**
 * The main grid of fields.
 *
 * @param {FieldsGridProps} props
 * @return {React.ReactElement} The main editing area.
 */
const FieldsGrid = ( { selectedFieldName, setSelectedFieldName } ) => {
	const { block, changeBlock } = useBlock();
	const [ currentLocation, setCurrentLocation ] = useState( DEFAULT_LOCATION );

	/**
	 * Adds a new field to the end of the existing fields.
	 */
	const addNewField = useCallback( () => {
		const fields = block.fields ? { ...block.fields } : {};
		const newFieldNumber = getNewFieldNumber( fields );
		const name = newFieldNumber
			? `new-field-${ newFieldNumber.toString() }`
			: 'new-field';
		const label = newFieldNumber
			? sprintf(
				// translators: %s: the field number
				__( 'New Field %s', 'genesis-custom-blocks' ),
				newFieldNumber.toString()
			)
			: __( 'New Field', 'genesis-custom-blocks' );

		const newField = {
			name,
			label,
			control: 'text',
			type: 'string',
			location: currentLocation,
			order: Object.values( fields ).length,
		};

		fields[ name ] = newField;
		changeBlock( { fields } );
	}, [ block, changeBlock, currentLocation ] );

	/**
	 * Gets the fields for either the editor or inspector.
	 *
	 * @param {string} location The location, like 'editor', or 'inspector'.
	 * @return {Array} The fields with the given location.
	 */
	const getFieldsForLocation = useCallback( ( location ) => {
		if ( ! block || ! block.fields ) {
			return null;
		}

		return getFieldsAsArray( block.fields ).filter( ( field ) => {
			if ( 'editor' === location ) {
				return ! field.location || 'editor' === field.location;
			}

			return field.location === 'inspector';
		} );
	}, [ block ] );

	/**
	 * Reorders fields, moving a single field to another position.
	 *
	 * @param {number} moveFrom The index of the field to move.
	 * @param {number} moveTo The index that the field should be moved to.
	 */
	const reorderFields = useCallback( ( moveFrom, moveTo ) => {
		const fieldsToReorder = getFieldsForLocation( currentLocation );
		if ( ! fieldsToReorder.length ) {
			return;
		}

		const newFields = [ ...fieldsToReorder ];
		[ newFields[ moveFrom ], newFields[ moveTo ] ] = [ newFields[ moveTo ], newFields[ moveFrom ] ];

		const newFieldsWithOrder = newFields.reduce( ( accumulator, field, index ) => {
			return [
				...accumulator,
				{
					...field,
					order: index,
				},
			];
		}, [] );

		changeBlock( {
			fields: getFieldsAsObject(
				[
					...newFieldsWithOrder,
					...getFieldsForLocation( getOtherLocation( currentLocation ) ),
				]
			),
		} );
	}, [ changeBlock, getFieldsForLocation, currentLocation ] );

	const fields = getFieldsForLocation( currentLocation );
	const locationButtonClass = 'h-12 px-4 text-sm focus:outline-none';
	const moveButtonClass = 'flex items-center justify-center text-sm w-6 h-5 hover:text-blue-700 z-10';
	const buttonDisabledClasses = 'opacity-50 cursor-not-allowed';

	return (
		<>
			<div className="flex mt-6">
				<button
					className={ locationButtonClass }
					onClick={ () => {
						setCurrentLocation( DEFAULT_LOCATION );
					} }
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
					onClick={ () => {
						setCurrentLocation( ALTERNATE_LOCATION );
					} }
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
					fields && fields.length
						? fields.map( ( field, index ) => {
							const selectField = () => {
								setSelectedFieldName( field.name );
							};
							const isUpButtonDisabled = 0 === index;
							const isDownButtonDisabled = index >= ( fields.length - 1 );
							const isSelected = field.name === selectedFieldName;

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
									aria-label={
										sprintf(
											// translators: %s: the label of the field
											__( 'Field: %s', 'genesis-custom-blocks' ),
											field.label
										)
									}
									onClick={ selectField }
									onKeyPress={ selectField }
								>
									<div
										className="relative flex items-center w-full p-4 bg-white border border-gray-400 rounded-sm hover:border-black"
										id={ `field-item-${ index }` }
									>
										<div>
											<svg className="fill-current h-6 w-6" viewBox="0 0 24 24">
												<path d="M0 0h24v24H0z" fill="none" />
												<path d="M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z" />
											</svg>
										</div>
										<span className=" ml-4 truncate">{ field.label }</span>
										<div className="flex items-center h-6 px-2 bg-gray-200 rounded-sm ml-auto hover:bg-gray-400">
											<span className="text-xs font-mono">{ field.name }</span>
											<ClipboardCopy text={ field.name } />
										</div>
										<div
											className={ className(
												isSelected ? 'flex' : 'hidden',
												'builder-field-move absolute top-0 left-0 flex-col justify-between top-0 left-0 -ml-8 mt-0 rounded-sm bg-white border border-black'
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
													reorderFields( index, index - 1 );
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
													reorderFields( index, index + 1 );
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
									</div>
								</div>
							);
						} )
						: null
				}
			</div>
			<button
				className="flex items-center justify-center h-6 w-6 bg-black rounded-sm text-white mt-4 ml-auto"
				onClick={ addNewField }
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
