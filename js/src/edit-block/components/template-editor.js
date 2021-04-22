/**
 * External dependencies
 */
import * as React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-textmate';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TemplateButtons } from './';
import { MARKUP_TEMPLATE_MODE } from '../constants';
import { useBlock, useField } from '../hooks';

/**
 * @typedef {Object} TemplateEditorProps The component props.
 * @property {import('./editor').CurrentLocation} currentLocation The currently selected location.
 * @property {import('./editor').SelectedField|import('../constants').NoFieldSelected} selectedField The currenetly selected field.
 * @property {import('./editor').SetIsNewField} setIsNewField Sets if there is a new field.
 * @property {import('./editor').SetPanelDisplaying} setPanelDisplaying Sets the current panel displaying.
 * @property {import('./editor').SetSelectedField} setSelectedField Sets the name of the selected field.
 * @property {string|null} [parentField] The name of the parent field, if any.
 */

/**
 * The editor for the template markup and CSS.
 *
 * @return {React.ReactElement} The fields displayed in a grid.
 */
const TemplateEditor = () => {
	const [ templateMode, setTemplateMode ] = useState( MARKUP_TEMPLATE_MODE );
	const { block, changeBlock } = useBlock();
	const { getFields } = useField();
	const {
		templateCss = '',
		templateMarkup = '',
	} = block;
	const exampleFieldName = getFields()?.shift()?.name ?? 'foo-baz';
	const urlTemplateDocumentation = 'https://developer.wpengine.com/genesis-custom-blocks/get-started/add-a-custom-block-to-your-website-content/';

	return (
		<>
			<TemplateButtons
				templateMode={ templateMode }
				setTemplateMode={ setTemplateMode }
			/>
			{
				MARKUP_TEMPLATE_MODE === templateMode
					? (
						<>
							<p className="text-sm mt-1 mb-2">
								{ __( 'To render a field, enter the field name (slug) enclosed in 2 brackets', 'genesis-custom-blocks' ) }
							</p>
							<p className="block text-sm mt-1 mb-2">
								{
									sprintf(
										/* translators: %1$s: the field name (slug). */
										__( 'For example, the field %1$s would be %2$s', 'genesis-custom-blocks' ),
										exampleFieldName,
										`{{${ exampleFieldName }}}`
									)
								}
							</p>
							<a
								href={ urlTemplateDocumentation }
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm mt-1 mb-5"
							>
								<span>
									{ __( 'Learn more', 'genesis-custom-blocks' ) }
								</span>
							</a>
						</>
					)
					: null
			}
			<AceEditor
				value={ MARKUP_TEMPLATE_MODE === templateMode ? templateMarkup : templateCss }
				mode={ MARKUP_TEMPLATE_MODE === templateMode ? 'html' : 'css' }
				theme="textmate"
				height="40rem"
				onChange={ ( newEditorValue ) => {
					const blockProperty = MARKUP_TEMPLATE_MODE === templateMode ? 'templateMarkup' : 'templateCss';
					changeBlock( {
						[ blockProperty ]: newEditorValue,
					} );
				} }
				name="gcb-template-editor"
				editorProps={ { $blockScrolling: true } }
				setOptions={ {
					highlightActiveLine: true,
				} }
			/>
		</>
	);
};

export default TemplateEditor;
