/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { FieldsGrid, PostTitle } from './';
import { useBlock } from '../hooks';

/**
 * @typedef {Object} MainProps The component props.
 * @property {string} currentLocation The currently selected location.
 * @property {string|null} selectedField The currently selected field.
 * @property {Function} setCurrentLocation Sets the currently selected location.
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
	setPanelDisplaying,
	setSelectedField,
} ) => {
	const { block, changeBlock } = useBlock();
	const editedTitle = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostAttribute( 'title' ),
		[]
	);

	// When the title is edited, update it in the block JSON.
	const changeTitle = useCallback( () => {
		if (
			( editedTitle && editedTitle !== block.title ) ||
			( ! editedTitle && block.title ) // If the user deletes the title.
		) {
			changeBlock( { title: editedTitle } );
		}
	}, [ block, changeBlock, editedTitle ] );

	useEffect( () => {
		changeTitle();
	}, [ changeTitle ] );

	return (
		<div className="flex flex-col flex-grow items-start w-full overflow-scroll">
			<div className="flex flex-col w-full max-w-2xl mx-auto pb-64">
				<div className="block-title-field w-full mt-10 text-center focus:outline-none">
					<PostTitle />
				</div>
				<FieldsGrid
					currentLocation={ currentLocation }
					selectedField={ selectedField }
					setCurrentLocation={ setCurrentLocation }
					setPanelDisplaying={ setPanelDisplaying }
					setSelectedField={ setSelectedField }
				/>
			</div>
		</div>
	);
};

export default Main;
