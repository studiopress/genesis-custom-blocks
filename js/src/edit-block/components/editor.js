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
import { StrictMode, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';

import {
	BlockEditorProvider,
	BlockList,
	WritingFlow,
	ObserveTyping,
	BlockEditorKeyboardShortcuts,
	storeConfig as blockEditorStoreConfig,
	BlockInspector,
	BlockBreadcrumb,
	MediaUpload,
	MediaUploadCheck,
	MediaPlaceholder,
	MediaReplaceFlow,
} from '@wordpress/block-editor';
import { DropZoneProvider, SlotFillProvider, Slot, Popover, FormTokenField, Snackbar } from '@wordpress/components';
import { registerBlockType, parse } from '@wordpress/blocks';
import { registerCoreBlocks } from '@wordpress/block-library';
registerCoreBlocks();

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
	EDITOR_PREVIEW_EDITING_MODE,
	FRONT_END_PREVIEW_EDITING_MODE,
	NO_FIELD_SELECTED,
	TEMPLATE_EDITOR_EDITING_MODE,
} from '../constants';
import { DEFAULT_LOCATION } from '../../common/constants';
import { useBlock, useField, useTemplate } from '../hooks';
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
	const { block, changeBlock } = useBlock();
	const { template } = useTemplate();
	const { previewAttributes = {} } = block;
	const { getFields } = useField();
	const post = useSelect(
		( select ) => select( 'core' ).getEntityRecord( 'postType', postType, postId ),
		[ postId, postType ]
	);
	const [ currentLocation, setCurrentLocation ] = useState( DEFAULT_LOCATION );
	const [ editorMode, setEditorMode ] = useState( BUILDER_EDITING_MODE );
	const [ isNewField, setIsNewField ] = useState( false );
	const [ panelDisplaying, setPanelDisplaying ] = useState( BLOCK_PANEL );
	const [ selectedField, setSelectedField ] = useState( NO_FIELD_SELECTED );

	/** @param {Object} newAttributes Attribute (field) name and value. */
	const setAttributes = ( newAttributes ) => {
		changeBlock( {
			previewAttributes: {
				...previewAttributes,
				...newAttributes,
			},
		} );
	};

	if ( ! post ) {
		return null;
	}

	return (
		<StrictMode>
			<div className="h-screen flex flex-col items-center text-black">
				{ template?.cssUrl ? <link rel="stylesheet" href={ template.cssUrl } type="text/css" /> : null }
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
												fields={ getFields() }
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
								{ TEMPLATE_EDITOR_EDITING_MODE === editorMode
									? (
										<FrontendTemplateEditor />
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

function FrontendTemplateEditor( props ) {
	
	const [blocks, updateBlocks] = useState( parse( '' ) );

	return(
		<div style={{
			width:'100%',
		}}>
			<style>
			{`
				.max-w-2xl{
					max-width:100%!important;
				}
				.text-blue-700{
					display:none;
				}
				.wp-block{
					max-width:100%!important;
				}
			`}
			</style>
			<SlotFillProvider>
				<DropZoneProvider>
					<BlockEditorProvider
						value={ blocks }
						onChange={ updateBlocks }
						onInput={ updateBlocks }
						settings={{
							mediaUploadCheck: MediaUploadCheck,
							mediaUpload: MediaUpload,
							mediaPlaceholder: MediaPlaceholder,
							mediaReplaceFlow: MediaReplaceFlow,
						}}
					>
						<BlockEditorKeyboardShortcuts />
						<WritingFlow>
							<ObserveTyping>
								<Popover.Slot name="block-toolbar" />
								<div className="block-editor-columns">
									<div
										className={'column'}
										style={{
											position:'relative',
										}}
									>
										<div className="edit-post-visual-editor editor-styles-wrapper">
											<BlockList />
										</div>
										<div style={{
											position:'fixed',
											bottom:'0px',
											right:'0px',
											left: '0px',
											width:'100%',
											backgroundColor: '#fff',
											padding:'4px',
											zIndex: '999',
										}}><BlockBreadcrumb /></div>
									</div>
									<div
										hidden
										className={'column'}
										style={{
											width:'300px',
											height:'100%',
											position:'fixed',
											right:'0px',
											top:'0px',
											backgroundColor: '#fff',
											borderLeft: '1px solid #000',
											zIndex: '999999999999',
											overflowY: 'scroll',
										}}
									>
										<BlockInspector />
									</div>
								</div>
							</ObserveTyping>
						</WritingFlow>
					</BlockEditorProvider>
				</DropZoneProvider>
				<Popover.Slot />
			</SlotFillProvider>
		</div>
	)
}


registerBlockType( 'gcb/frontend-element', {
	title: __( 'GCB Frontend Element', 'genesis-custom-blocks' ),
	category: 'common',

	attributes: {},

	edit( props ) {
		const { getFields } = useField();
		const availableFields = getFields();
		const [tagType, setTagType] = useState();
		const [imgSrc, setImgSrc] = useState();
		const [imgAltText, setImgAltText] = useState();
		const [h1, setH1] = useState();
		
		console.log( 'Available fields: ', availableFields );
		
		function renderFieldList() {
			const renderedFields = availableFields.map( (field) => {
				return <option value={field.name}>{ field.label }</option>
			});
			
			renderedFields.unshift( <option>Pick a field to use</option> );
			return renderedFields;
		}

		function renderImageControls() {
			if ( 'img' !== tagType ) {
				return '';
			}
			
			return <div style={{
				boxSizing: 'border-box',
				border: '1px solid #b7b7b7',
				padding: '20px',
				backgroundColor: '#eaeaea1a',
			}}>
				<div style={{marginBottom:'10px'}}>
					<label style={{marginRight: '10px'}} htmlFor="fieldPicker">
						Which field is the Image URL?
					</label>
					<div>
						<select name="fieldPicker" onChange={(event) => {
							setImgSrc( event.target.value );
						}}>
							{renderFieldList()}
						</select>
					</div>
				</div>
				<div style={{marginBottom:'10px'}}>
					<label style={{marginRight: '10px'}} htmlFor="fieldPicker">
						Which field is the Image Alt Text (for vision-impaired people with screenreaders)
					</label>
					<div>
						<select name="fieldPicker" onChange={(event) => {
							setImgAltText( event.target.value );
						}}>
							{renderFieldList()}
						</select>
					</div>
				</div>
			</div>
		}
		
		function renderH1Controls() {
			if ( 'h1' !== tagType ) {
				return '';
			}
			
			return <div style={{
				boxSizing: 'border-box',
				border: '1px solid #b7b7b7',
				padding: '20px',
				backgroundColor: '#eaeaea1a',
			}}>
				<div style={{marginBottom:'10px'}}>
					<label style={{marginRight: '10px'}} htmlFor="fieldPicker">
						Which field will be used for the title?
					</label>
					<div>
						<select name="fieldPicker" onChange={(event) => {
							setH1( event.target.value );
						}}>
							{renderFieldList()}
						</select>
					</div>
				</div>
			</div>
		}

		return [
			<>
				<div style={{
					boxSizing: 'border-box',
					border: '1px solid #b7b7b7',
					padding: '20px',
					backgroundColor: '#eaeaea1a',
				}}>
					<label style={{
							marginRight: '10px',
						}}
						htmlFor="elementType"
					>
							What do you want to add to your front-end template?
					</label>
					<select name="elementType" id="elementType" onChange={(event) => {
						setTagType( event.target.value );
					}}>
						<option value="img">Choose something to show</option>
						<option value="img">An image (img)</option>
						<option value="h1">A main title (h1)</option>
						<option value="h2">A sub-title (h2)</option>
						<option value="p">Just some text (p)</option>
					</select>
					{renderImageControls()}
					{renderH1Controls()}
				</div>
			</>
		]
	},

	save( props ) {
		return <InnerBlocks.Content />;
	}

} );


export default Editor;
