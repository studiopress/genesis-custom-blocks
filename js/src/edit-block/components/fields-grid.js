/**
 * External dependencies
 */
import * as React from 'react';
import className from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useBlock } from '../hooks';
import { getNewFieldNumber } from '../helpers';

/**
 * The main editing area component.
 *
 * Todo: add the rest of this and make it dynamic.
 *
 * @return {React.ReactElement} The main editing area.
 */
const FieldsGrid = () => {
	const { block, changeBlock } = useBlock();

	const addNewField = useCallback( () => {
		const newFields = block.fields ? { ...block.fields } : {};
		const newFieldNumber = getNewFieldNumber( newFields );
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
		};

		newFields[ name ] = newField;
		changeBlock( 'fields', newFields );
	}, [ block, changeBlock ] );

	/**
	 * Gets a class for a given width.
	 *
	 * @param {string} width The width as a string.
	 * @return {string} The class for the width.
	 */
	const getWidthClass = ( width ) => {
		const defaultWidth = '4';
		const widthOrDefault = 'string' === typeof width && width
			? ( parseInt( width ) / 25 ).toString()
			: defaultWidth;
		return `col-span-${ widthOrDefault }`;
	};

	return (
		<>
			<div className="grid grid-cols-4 gap-4 w-full items-start mt-2">
				{
					block.fields && Object.values( block.fields ).length
						? Object.values( block.fields ).map( ( field, index ) => {
							return (
								<div
									className={ className(
										'field w-full',
										getWidthClass( field.width )
									) }
									key={ `field-item-${ index }` }
								>
									<div className="relative flex items-center w-full p-4 bg-white border border-gray-400 rounded-sm cursor-pointer hover:border-black">
										<button className="field-resize w-4 absolute -ml-2 left-0 top-0 bottom-0 focus:outline-none"></button>
										<button className="cursor-move">
											<svg className="fill-current h-6 w-6" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z" /></svg>
										</button>
										<span className=" ml-4 truncate">{ field.label }</span>
										<button className="flex items-center h-6 px-2 bg-gray-200 rounded-sm ml-auto hover:bg-gray-400">
											<span className="text-xs font-mono">{ field.name }</span>
											<svg className="h-4 w-4 fill-current ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path><path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"></path></svg>
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
