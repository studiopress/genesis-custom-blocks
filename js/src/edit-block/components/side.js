/**
 * External dependencies
 */
import * as React from 'react';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BlockPanel, FieldPanel } from './';

/**
 * @typedef {Object} SideProps The component props.
 * @property {string} selectedFieldName The name of the selected field.
 * @property {Function} setCurrentLocation Sets the current location, like 'editor'.
 */

/**
 * The Side component.
 *
 * @param {SideProps} props
 * @return {React.ReactElement} The side area.
 */
const Side = ( { selectedFieldName, setCurrentLocation } ) => {
	const [ displayBlockPanel, setDisplayBlockPanel ] = useState( true );
	const buttonClass = 'flex items-center h-12 px-5 text-sm focus:outline-none';

	return (
		<div className="side flex-shrink-0 flex flex-col border-l border-gray-300 overflow-scroll">
			<div className="flex w-full border-b border-gray-300">
				<button
					onClick={ () => setDisplayBlockPanel( true ) }
					className={ classNames(
						buttonClass,
						{ 'font-semibold border-b-4 border-blue-600': displayBlockPanel }
					) }
				>
					{ __( 'Block', 'genesis-custom-blocks' ) }
				</button>
				<button
					onClick={ () => setDisplayBlockPanel( false ) }
					className={
						classNames(
							buttonClass,
							{ 'font-semibold border-b-4 border-blue-600': ! displayBlockPanel }
						)
					}
				>
					{ __( 'Field', 'genesis-custom-blocks' ) }
				</button>
			</div>
			{ displayBlockPanel
				? <BlockPanel />
				: <FieldPanel selectedFieldName={ selectedFieldName } setCurrentLocation={ setCurrentLocation } />
			}
		</div>
	);
};

export default Side;
