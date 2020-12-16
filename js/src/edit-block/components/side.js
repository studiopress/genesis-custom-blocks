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
 * @property {import('./editor').CurrentLocation} currentLocation The currently selected location.
 * @property {import('./editor').IsNewField} isNewField Whether there is a new field.
 * @property {import('./editor').PanelDisplaying} panelDisplaying The panel currently displaying in the side, like 'block'.
 * @property {import('./editor').SelectedField|import('../constants').NoFieldSelected} selectedField The name of the selected field, if any.
 * @property {import('./editor').SetCurrentLocation} setCurrentLocation Sets the current location, like 'editor'.
 * @property {import('./editor').SetIsNewField} setIsNewField Sets if there is a new field.
 * @property {import('./editor').SetPanelDisplaying} setPanelDisplaying Sets the panel currently displaying in the side.
 * @property {import('./editor').SetSelectedField} setSelectedField Sets the selected field name.
 */

/**
 * The Side component.
 *
 * @param {SideProps} props
 * @return {React.ReactElement} The side area.
 */
const Side = ( {
	currentLocation,
	isNewField,
	panelDisplaying,
	selectedField,
	setCurrentLocation,
	setIsNewField,
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
						currentLocation={ currentLocation }
						isNewField={ isNewField }
						selectedField={ selectedField }
						setCurrentLocation={ setCurrentLocation }
						setIsNewField={ setIsNewField }
						setSelectedField={ setSelectedField }
					/>
				)
			}
		</div>
	);
};

export default Side;
