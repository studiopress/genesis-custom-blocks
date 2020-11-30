/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { PostTitle } from '@wordpress/editor';
import { useCallback, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { FieldsGrid } from './';
import { useBlock } from '../hooks';

/**
 * @typedef {Object} MainProps The component props.
 * @property {Function} setSelectedFieldName Sets the name of the selected field.
 */

/**
 * The main editing area component.
 *
 * Todo: add the rest of this and make it dynamic.
 *
 * @param {MainProps} props
 * @return {React.ReactElement} The main editing area.
 */
const Main = ( { setSelectedFieldName } ) => {
	const { block, changeBlock } = useBlock();
	const editedTitle = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostAttribute( 'title' ),
		[]
	);

	// When the title is edited, update it in the block JSON.
	const changeTitle = useCallback( () => {
		if ( editedTitle !== block.title ) {
			changeBlock( 'title', editedTitle );
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
				<FieldsGrid setSelectedFieldName={ setSelectedFieldName } />
			</div>
		</div>
	);
};

export default Main;
