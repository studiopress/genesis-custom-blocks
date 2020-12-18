/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	EditorNotices,
	ErrorBoundary,
	UnsavedChangesWarning,
} from '@wordpress/editor';
import { StrictMode, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BrowserURL, EditorProvider, Header, Main, Side } from './';
import {
	BLOCK_PANEL,
	DEFAULT_LOCATION,
	NO_FIELD_SELECTED,
} from '../constants';
import { getDefaultBlock } from '../helpers';
import { useBlock } from '../hooks';

/**
 * @callback onErrorType Handler for errors.
 * @return {void}
 */

/**
 * @typedef {Object} EditorProps The component props.
 * @property {onErrorType} onError Handler for errors.
 * @property {number} postId The current post ID.
 * @property {string} postType The current post type.
 * @property {Object} settings The editor settings.
 */

/**
 * @typedef {Object} SelectedField A field to change.
 * @property {string} name The name of the field.
 * @property {string} [parent] The name of the field's parent, if any.
 */

/** @typedef {string} CurrentLocation The currently selected location. */
/** @typedef {boolean} IsNewField Whether there is a new field. */
/** @typedef {string} PanelDisplaying The panel currently displaying in the side, like 'block'. */
/** @typedef {function(string):void} SetCurrentLocation Sets the currently selected location */
/** @typedef {function(boolean):void} SetIsNewField Sets whether there is a new field. */
/** @typedef {function(string):void} SetPanelDisplaying Sets the current panel displaying. */
/** @typedef {function(SelectedField|import('../constants').NoFieldSelected):void} SetSelectedField Sets the selected field. */

/**
 * @typedef {Object} Field A block field, can have more properties depending on its settings.
 * @property {string} name The name of the field.
 * @property {string} label The label of the field.
 * @property {string} control The control type, like 'text' or 'textarea'.
 * @property {string} location The location, like 'editor'.
 * @property {string} type The data type for its value, like string.
 * @property {number} order Its order relative to other fields in its location, like 0, 1, 2...
 * @property {string} [parent] The name of its parent field, like a Repeater control.
 * @property {Object} [sub_fields] Fields that this field has, like for the Repeater control.
 * @property {string|number} [width] The width, like '25'.
 */

/**
 * The editor component.
 *
 * @param {EditorProps} props The component props.
 * @return {React.ReactElement} The editor.
 */
const Editor = ( { onError, postId, postType, settings } ) => {
	const { block, changeBlockName } = useBlock();
	const [ currentLocation, setCurrentLocation ] = useState( DEFAULT_LOCATION );
	const [ isNewField, setIsNewField ] = useState( false );
	const [ panelDisplaying, setPanelDisplaying ] = useState( BLOCK_PANEL );
	const [ selectedField, setSelectedField ] = useState( NO_FIELD_SELECTED );

	const post = useSelect(
		( select ) => select( 'core' ).getEntityRecord( 'postType', postType, postId ),
		[ postId, postType ]
	);
	const isSavingPost = useSelect( ( select ) => select( 'core/editor' ).isSavingPost() );

	useEffect( () => {
		if ( isSavingPost && ! block.name ) {
			const defaultBlock = getDefaultBlock( postId );
			changeBlockName( defaultBlock.name, defaultBlock );
		}
	}, [ block, changeBlockName, isSavingPost, postId ] );

	if ( ! post ) {
		return null;
	}

	return (
		<StrictMode>
			<div className="h-screen flex flex-col items-center text-black">
				<BrowserURL />
				<UnsavedChangesWarning />
				<EditorProvider
					post={ post }
					settings={ settings }
				>
					<ErrorBoundary onError={ onError }>
						<Header />
						<EditorNotices />
						<div className="flex w-full h-0 flex-grow">
							<Main
								currentLocation={ currentLocation }
								selectedField={ selectedField }
								setCurrentLocation={ setCurrentLocation }
								setIsNewField={ setIsNewField }
								setPanelDisplaying={ setPanelDisplaying }
								setSelectedField={ setSelectedField }
							/>
							<Side
								currentLocation={ currentLocation }
								isNewField={ isNewField }
								panelDisplaying={ panelDisplaying }
								selectedField={ selectedField }
								setPanelDisplaying={ setPanelDisplaying }
								setCurrentLocation={ setCurrentLocation }
								setIsNewField={ setIsNewField }
								setSelectedField={ setSelectedField }
							/>
						</div>
					</ErrorBoundary>
				</EditorProvider>
			</div>
		</StrictMode>
	);
};

export default Editor;
