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
import { BUILDER_EDITING_MODE } from '../constants';
import { EDITOR_LOCATION, INSPECTOR_LOCATION } from '../../common/constants';
/**
 * @typedef {Object} LocationButtonProps The component props.
 * @property {import('./editor').CurrentLocation} currentLocation The currently selected location.
 * @property {import('./editor').EditorMode} editorMode The current editor mode.
 * @property {import('./editor').SetCurrentLocation} setCurrentLocation Sets the current location.
 */

/**
 * Buttons that select which location is displaying.
 *
 * @param {LocationButtonProps} props
 * @return {React.ReactElement} The location buttons.
 */
const LocationButtons = ( {
	currentLocation,
	editorMode,
	setCurrentLocation,
} ) => {
	const buttonClass = 'w-40 h-12 px-4 text-sm';

	return BUILDER_EDITING_MODE === editorMode
		? (
			<div className="flex">
				<button
					className={ buttonClass }
					onClick={ () => setCurrentLocation( EDITOR_LOCATION ) }
				>
					<span
						className={ classNames( {
							'font-semibold': EDITOR_LOCATION === currentLocation,
						} ) }
					>
						{ __( 'Editor Fields', 'genesis-custom-blocks' ) }
					</span>
				</button>
				<button
					className={ buttonClass }
					onClick={ () => setCurrentLocation( INSPECTOR_LOCATION ) }
				>
					<span
						className={ classNames( {
							'font-semibold': INSPECTOR_LOCATION === currentLocation,
						} ) }
					>
						{ __( 'Inspector Fields', 'genesis-custom-blocks' ) }
					</span>
				</button>
			</div>
		) : null;
};

export default LocationButtons;
