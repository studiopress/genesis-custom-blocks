/**
 * External dependencies
 */
import * as React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
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
 * The editor for the template markup and CSS.
 *
 * @return {React.ReactElement} The fields displayed in a grid.
 */
const TemplateEditor = () => {
	const [ templateMode, setTemplateMode ] = useState( MARKUP_TEMPLATE_MODE );
	const { block, changeBlock } = useBlock();
	const { getFields } = useField();
	const { templateCss = '', templateMarkup = '' } = block;
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
								{ __( 'To render a field, enter the field name (slug) enclosed in 2 brackets.', 'genesis-custom-blocks' ) }
							</p>
							<p className="flex items-center w-full text-sm mt-1 mb-2">
								{
									sprintf(
										/* translators: %1$s: the field name (slug). */
										__( 'For example, the field %1$s would be', 'genesis-custom-blocks' ),
										exampleFieldName
									)
								}
								&nbsp;
								<span className="flex items-center h-6 pl-1 pr-1 bg-gray-200 rounded-sm hover:bg-gray-300">
									<span className="text-xs truncate font-mono">
										{ `{{${ exampleFieldName }}}` }
									</span>
								</span>
							</p>
							<a
								href={ urlTemplateDocumentation }
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-max text-sm text-blue-700 mt-1 md:underline"
							>
								{ __( 'Learn more', 'genesis-custom-blocks' ) }
							</a>
						</>
					)
					: null
			}
			<AceEditor
				className="mt-8"
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
				editorProps={ {
					$blockScrolling: true,
				} }
				setOptions={ {
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					highlightActiveLine: true,
					useWorker: false,
				} }
			/>
		</>
	);
};

export default TemplateEditor;
