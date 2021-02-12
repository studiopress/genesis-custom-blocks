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
import { useState, StrictMode } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import {
	BlockPanel,
	BrowserURL,
	EditorProvider,
	FieldPanel,
	FieldsGrid,
	Header,
	LocationButtons,
	Main,
	Side,
} from './';
import {
	BLOCK_PANEL,
	BUILDER_EDITING_MODE,
	DEFAULT_LOCATION,
	EDITOR_PREVIEW_EDITING_MODE,
	FRONT_END_PREVIEW_EDITING_MODE,
	NO_FIELD_SELECTED,
} from '../constants';
import { useBlock, useField } from '../hooks';
import { Fields } from '../../block-editor/components';

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
/** @typedef {string} EditorMode The current editing mode. */

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
 * @property {string} [width] The width, like '25'.
 */

/**
 * The editor component.
 *
 * @param {EditorProps} props The component props.
 * @return {React.ReactElement} The editor.
 */
const Editor = ( { onError, postId, postType, settings } ) => {
	const { block } = useBlock();
	const [ currentLocation, setCurrentLocation ] = useState( DEFAULT_LOCATION );
	const [ editorMode, setEditorMode ] = useState( BUILDER_EDITING_MODE );
	const [ isNewField, setIsNewField ] = useState( false );
	const [ panelDisplaying, setPanelDisplaying ] = useState( BLOCK_PANEL );
	const [ selectedField, setSelectedField ] = useState( NO_FIELD_SELECTED );
	const [ previewAttributes, setPreviewAttributes ] = useState( {} );

	const post = useSelect(
		( select ) => select( 'core' ).getEntityRecord( 'postType', postType, postId ),
		[ postId, postType ]
	);

	const setAttributes = ( newAttributes ) => {
		setPreviewAttributes( {
			...previewAttributes,
			...newAttributes,
		} );
	};

	const { getFieldsForLocation } = useField();

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
						<Header editorMode={ editorMode } setEditorMode={ setEditorMode } />
						<EditorNotices />
						<div className="gcb-editor flex w-full h-0 flex-grow">
							<Main>
								<LocationButtons
									currentLocation={ currentLocation }
									editorMode={ editorMode }
									setCurrentLocation={ setCurrentLocation }
								/>
								{ EDITOR_PREVIEW_EDITING_MODE === editorMode && block && block.fields
									? (
										<div className="block-form">
											<Fields
												key="example-fields"
												fields={ getFieldsForLocation( currentLocation ) }
												parentBlockProps={ {
													setAttributes,
													attributes: previewAttributes,
												} }
												parentBlock={ {} }
											/>
										</div>
									) : null
								}
								{ BUILDER_EDITING_MODE === editorMode
									? (
										<FieldsGrid
											currentLocation={ currentLocation }
											selectedField={ selectedField }
											setIsNewField={ setIsNewField }
											setPanelDisplaying={ setPanelDisplaying }
											setSelectedField={ setSelectedField }
										/>
									) : null
								}
								{ FRONT_END_PREVIEW_EDITING_MODE === editorMode
									? (
										<ServerSideRender
											block={ `genesis-custom-blocks/${ block.name }` }
											attributes={ previewAttributes }
											className="genesis-custom-blocks-editor__ssr"
											httpMethod="POST"
										/>
									) : null
								}
							</Main>
							<Side
								panelDisplaying={ panelDisplaying }
								setPanelDisplaying={ setPanelDisplaying }
							>
								{
									BLOCK_PANEL === panelDisplaying
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
							</Side>
						</div>
					</ErrorBoundary>
				</EditorProvider>
			</div>
		</StrictMode>
	);
};

export default Editor;
