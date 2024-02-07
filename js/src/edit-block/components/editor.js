/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { SlotFillProvider } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import {
	EditorNotices,
	ErrorBoundary,
	UnsavedChangesWarning,
} from '@wordpress/editor';
import { StrictMode, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	BlockPanel,
	BrowserURL,
	EditorPreview,
	EditorProvider,
	FieldPanel,
	FieldsGrid,
	FrontEndPreview,
	Header,
	LocationButtons,
	Main,
	Side,
	TemplateEditor,
} from './';
import {
	BLOCK_PANEL,
	BUILDER_EDITING_MODE,
	EDITOR_PREVIEW_EDITING_MODE,
	FRONT_END_PREVIEW_EDITING_MODE,
	NO_FIELD_SELECTED,
	TEMPLATE_EDITOR_EDITING_MODE,
} from '../constants';
import { DEFAULT_LOCATION } from '../../common/constants';
import { useBlock, useTemplate } from '../hooks';

/**
 * @callback onErrorType Handler for errors.
 * @return {void}
 */

/**
 * @typedef {Object} EditorProps The component props.
 * @property {onErrorType} onError  Handler for errors.
 * @property {number}      postId   The current post ID.
 * @property {string}      postType The current post type.
 * @property {Object}      settings The editor settings.
 */

/**
 * @typedef {Object} SelectedField A field to change.
 * @property {string} name     The name of the field.
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
/** @typedef {function(EditorMode):void} SetEditorMode Sets the current editing mode. */

/**
 * @typedef {Object} Field A block field, can have more properties depending on its settings.
 * @property {string} name         The name of the field.
 * @property {string} label        The label of the field.
 * @property {string} control      The control type, like 'text' or 'textarea'.
 * @property {string} location     The location, like 'editor'.
 * @property {string} type         The data type for its value, like string.
 * @property {number} order        Its order relative to other fields in its location, like 0, 1, 2...
 * @property {string} [parent]     The name of its parent field, like a Repeater control.
 * @property {Object} [sub_fields] Fields that this field has, like for the Repeater control.
 * @property {string} [width]      The width, like '25'.
 */

/**
 * @typedef {Object} Setting A field setting.
 * @see PHP class Genesis\CustomBlocks\Blocks\Controls\ControlSetting
 * @property {string} name    The name of the setting.
 * @property {string} label   The label of the setting to display in the GCB editor.
 * @property {string} help    A help value that display in the GCB editor.
 * @property {string} type    The setting type, like 'width' or 'text', not a data type like boolean.
 * @property {*}      default The default value.
 */

/**
 * The editor component.
 *
 * @param {EditorProps} props The component props.
 * @return {React.ReactElement} The editor.
 */
const Editor = ( { onError, postId, postType, settings } ) => {
	const { template, fetchTemplate } = useTemplate();
	const { block } = useBlock( fetchTemplate );
	const post = useSelect(
		( select ) => select( 'core' ).getEntityRecord( 'postType', postType, postId ),
		[ postId, postType ]
	);
	const [ currentLocation, setCurrentLocation ] = useState( DEFAULT_LOCATION );
	const [ editorMode, setEditorMode ] = useState( BUILDER_EDITING_MODE );
	const [ isNewField, setIsNewField ] = useState( false );
	const [ panelDisplaying, setPanelDisplaying ] = useState( BLOCK_PANEL );
	const [ selectedField, setSelectedField ] = useState( NO_FIELD_SELECTED );

	if ( ! post ) {
		return null;
	}

	return (
		<StrictMode>
			<div className="h-screen flex flex-col items-center text-black">
				{ template?.cssUrl ? <link rel="stylesheet" href={ template.cssUrl } type="text/css" /> : null }
				{ ! template?.cssUrl && Boolean( block.templateCss )
					? <style>{ block.templateCss }</style>
					: null
				}
				<BrowserURL />
				<UnsavedChangesWarning />
				<SlotFillProvider>
					<EditorProvider
						post={ post }
						settings={ settings }
					>
						<ErrorBoundary onError={ onError }>
							<Header editorMode={ editorMode } setEditorMode={ setEditorMode } template={ template } />
							<EditorNotices />
							<div className="gcb-editor flex w-full h-0 flex-grow">
								<Main editorMode={ editorMode } setEditorMode={ setEditorMode }>
									<LocationButtons
										currentLocation={ currentLocation }
										editorMode={ editorMode }
										setCurrentLocation={ setCurrentLocation }
									/>
									{ EDITOR_PREVIEW_EDITING_MODE === editorMode && block
										? <EditorPreview setEditorMode={ setEditorMode } />
										: null
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
										? <FrontEndPreview setEditorMode={ setEditorMode } />
										: null
									}
									{ TEMPLATE_EDITOR_EDITING_MODE === editorMode
										? <TemplateEditor />
										: null
									}
								</Main>
								<Side
									panelDisplaying={ panelDisplaying }
									setPanelDisplaying={ setPanelDisplaying }
								>
									{
										BLOCK_PANEL === panelDisplaying
											? <BlockPanel />
											: null
									}
									{
										BLOCK_PANEL !== panelDisplaying && BUILDER_EDITING_MODE === editorMode
											? (
												<FieldPanel
													currentLocation={ currentLocation }
													isNewField={ isNewField }
													selectedField={ selectedField }
													setCurrentLocation={ setCurrentLocation }
													setIsNewField={ setIsNewField }
													setSelectedField={ setSelectedField }
												/>
											) : null
									}
								</Side>
							</div>
						</ErrorBoundary>
					</EditorProvider>
				</SlotFillProvider>
			</div>
		</StrictMode>
	);
};

export default Editor;
