/**
 * External dependencies
 */
import * as React from 'react';
import className from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ALTERNATE_LOCATION, DEFAULT_LOCATION } from '../constants';

/**
 * @typedef {Object} LocationButtonProps The component props.
 * @property {import('./editor').CurrentLocation} currentLocation The currently selected location.
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
	setCurrentLocation,
} ) => {
	const buttonClass = 'w-40 h-12 px-4 text-sm focus:outline-none';

	return (
		<div className="flex mt-6">
			<button
				className={ buttonClass }
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
				className={ buttonClass }
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
	);
};

export default LocationButtons;
