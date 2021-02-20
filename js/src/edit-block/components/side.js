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
import { BLOCK_PANEL, FIELD_PANEL } from '../constants';

/**
 * @typedef {Object} SideProps The component props.
 * @property {React.ReactElement} children The component children.
 * @property {import('./editor').PanelDisplaying} panelDisplaying The panel currently displaying in the side, like 'block'.
 * @property {import('./editor').SetPanelDisplaying} setPanelDisplaying Sets the panel currently displaying in the side.
 */

/**
 * The Side component.
 *
 * @param {SideProps} props
 * @return {React.ReactElement} The side area.
 */
const Side = ( {
	children,
	panelDisplaying,
	setPanelDisplaying,
} ) => {
	const buttonClass = 'flex items-center h-12 px-5 text-sm focus:outline-none';

	return (
		<div className="side flex-shrink-0 flex flex-col border-l border-gray-300 overflow-scroll">
			<div className="flex flex-shrink-0 w-full border-b border-gray-300">
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
			{ children }
		</div>
	);
};

export default Side;
