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
import { FieldsGrid, PostTitle } from './';
import { ALTERNATE_LOCATION, DEFAULT_LOCATION } from '../constants';

/**
 * @typedef {Object} MainProps The component props.
 * @property {string} currentLocation The currently selected location.
 * @property {string|null} selectedField The currently selected field.
 * @property {Function} setCurrentLocation Sets the currently selected location.
 * @property {Function} setIsNewField Sets whether there is a new field.
 * @property {Function} setPanelDisplaying Sets the current panel displaying.
 * @property {Function} setSelectedField Sets the name of the selected field.
 */

/**
 * The main editing area component.
 *
 * Todo: add the rest of this and make it dynamic.
 *
 * @param {MainProps} props
 * @return {React.ReactElement} The main editing area.
 */
const Main = ( {
	currentLocation,
	selectedField,
	setCurrentLocation,
	setIsNewField,
	setPanelDisplaying,
	setSelectedField,
} ) => {
	const locationButtonClass = 'h-12 px-4 text-sm focus:outline-none';

	return (
		<div className="flex flex-col flex-grow items-start w-full overflow-scroll">
			<div className="flex flex-col w-full max-w-2xl mx-auto pb-64">
				<div className="block-title-field w-full mt-10 text-center focus:outline-none">
					<PostTitle />
				</div>
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
				<FieldsGrid
					currentLocation={ currentLocation }
					selectedField={ selectedField }
					setIsNewField={ setIsNewField }
					setPanelDisplaying={ setPanelDisplaying }
					setSelectedField={ setSelectedField }
				/>
			</div>
		</div>
	);
};

export default Main;
