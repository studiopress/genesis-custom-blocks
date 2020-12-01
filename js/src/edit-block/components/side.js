/**
 * External dependencies
 */
import * as React from 'react';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BlockPanel, FieldPanel } from './';
import { BLOCK_PANEL, FIELD_PANEL } from '../constants';

/**
 * @typedef {Object} SideProps The component props.
 * @property {string} panelDisplaying The panel currently displaying in the side, like 'block'.
 * @property {string} selectedField The name of the selected field.
 * @property {Function} setCurrentLocation Sets the current location, like 'editor'.
 * @property {Function} setPanelDisplaying Sets the panel currently displaying in the side.
 * @property {Function} setSelectedField Sets the selected field name.
 */

/**
 * The Side component.
 *
 * @param {SideProps} props
 * @return {React.ReactElement} The side area.
 */
const Side = ( {
	panelDisplaying,
	selectedField,
	setCurrentLocation,
	setPanelDisplaying,
	setSelectedField,
} ) => {
	const buttonClass = 'flex items-center h-12 px-5 text-sm focus:outline-none';

	return (
		<div className="side flex-shrink-0 flex flex-col border-l border-gray-300 overflow-scroll">
			<div className="flex w-full border-b border-gray-300">
				<button
					onClick={ () => setPanelDisplaying( BLOCK_PANEL ) }
					className={ classNames(
						buttonClass,
						{ 'font-semibold border-b-4 border-blue-600': BLOCK_PANEL === panelDisplaying }
					) }
				>
					{ __( 'Block', 'genesis-custom-blocks' ) }
				</button>
				<button
					onClick={ () => setPanelDisplaying( FIELD_PANEL ) }
					className={
						classNames(
							buttonClass,
							{ 'font-semibold border-b-4 border-blue-600': FIELD_PANEL === panelDisplaying }
						)
					}
				>
					{ __( 'Field', 'genesis-custom-blocks' ) }
				</button>
			</div>
			{ BLOCK_PANEL === panelDisplaying
				? <BlockPanel />
				: (
					<FieldPanel
						selectedField={ selectedField }
						setCurrentLocation={ setCurrentLocation }
						setSelectedField={ setSelectedField }
					/>
				)
			}
		</div>
	);
};

export default Side;
