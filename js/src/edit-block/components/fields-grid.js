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
import { getNewFieldNumber, getWidthClass } from '../helpers';
import { getFieldsAsArray } from '../../common/helpers';

/**
 * @typedef {Object} FieldsGridProps The component props.
 * @property {Function} setSelectedFieldName Sets the name of the selected field.
 */

/**
 * The main grid of fields.
 *
 * @param {FieldsGridProps} props
 * @return {React.ReactElement} The main editing area.
 */
const FieldsGrid = ( { setSelectedFieldName } ) => {
	const { block, changeBlock } = useBlock();
	const [ isEditorDisplay, setIsEditorDisplay ] = useState( true );

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
			location: isEditorDisplay ? 'editor' : 'inspector',
			order: Object.values( fields ).length,
		};

		fields[ name ] = newField;
		changeBlock( 'fields', fields );
	}, [ block, changeBlock ] );

	/**
	 * Gets the fields for either the editor or inspector.
	 *
	 * @return {Array} The fields with the given location.
	 */
	const getFieldsForLocation = useCallback( () => {
		if ( ! block || ! block.fields ) {
			return null;
		}

		return getFieldsAsArray( block.fields ).filter( ( field ) => {
			if ( isEditorDisplay ) {
				return ! field.location || 'editor' === field.location;
			}

			return field.location === 'inspector';
		} );
	}, [ block, isEditorDisplay ] );

	const fields = getFieldsForLocation();
	const buttonClass = 'focus:outline-none h-12 px-4 text-sm';

	return (
		<>
			<div className="flex mt-6">
				<button
					className={ buttonClass }
					onClick={ () => {
						setIsEditorDisplay( true );
					} }
				>
					<span
						className={ className( {
							'font-semibold': isEditorDisplay,
						} ) }
					>
						{ __( 'Editor Fields', 'genesis-custom-blocks' ) }
					</span>
				</button>
				<button
					className={ buttonClass }
					onClick={ () => {
						setIsEditorDisplay( false );
					} }
				>
					<span
						className={ className( {
							'font-semibold': ! isEditorDisplay,
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

							return (
								<div
									className={ className(
										'field w-full',
										getWidthClass( field.width )
									) }
									key={ `field-item-${ index }` }
									role="gridcell"
									tabIndex="0"
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
										<button className="field-resize w-4 absolute -ml-2 left-0 top-0 bottom-0 focus:outline-none"></button>
										<button>
											<svg className="fill-current h-6 w-6" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z" /></svg>
										</button>
										<span className=" ml-4 truncate">{ field.label }</span>
										<button className="flex items-center h-6 px-2 bg-gray-200 rounded-sm ml-auto hover:bg-gray-400">
											<span className="text-xs font-mono">{ field.name }</span>
											<ClipboardCopy text={ field.name } />
										</button>
										<button className="field-resize w-4 absolute -mr-2 right-0 top-0 bottom-0 focus:outline-none"></button>
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
