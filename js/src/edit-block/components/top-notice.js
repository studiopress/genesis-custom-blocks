/* global gcbEditor */

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { ClipboardCopy } from './';
import { useBlock } from '../hooks';

const TopNotice = () => {
	// @ts-ignore
	const { template: initialTemplate } = gcbEditor;
	const { block } = useBlock();
	const isSavingPost = useSelect( ( select ) => select( 'core/editor' ).isSavingPost() );
	const urlBlockTemplates = 'https://developer.wpengine.com/genesis-custom-blocks/get-started/add-a-custom-block-to-your-website-content/';
	const urlTemplateFunctions = 'https://developer.wpengine.com/genesis-custom-blocks/';
	const [ template, setTemplate ] = useState( initialTemplate );

	useEffect( () => {
		if ( isSavingPost && Boolean( block.name ) ) {
			apiFetch( {
				path: addQueryArgs(
					'/genesis-custom-blocks/template-file',
					{ blockName: block.name }
				),
			} ).then( ( response ) => {
				if ( response && response.hasOwnProperty( 'templatePath' ) ) {
					setTemplate( {
						templatePath: response.templatePath,
						templateExists: response.templateExists,
					} );
				}
			} );
		}
	}, [ block.name, isSavingPost ] );

	return (
		template.templateExists
			? <div className="flex items-center mt-4">
				<span className="text-sm">{ __( 'Template:', 'genesis-custom-blocks' ) }</span>
				&nbsp;
				<span className="text-sm font-mono">{ template.templatePath }</span>
				<ClipboardCopy text={ template.templatePath } />
			</div>
			: <div className="mt-4 p-5 bg-blue-100 text-blue-700 border-l-4 border-blue-700 rounded-sm">
				<div className="flex items-center">
					<svg className="w-6 h-6 fill-current" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
					<h4 className="text-lg font-semibold text-blue-900 ml-2">
						{ __( 'Next step: Build your block template.', 'genesis-custom-blocks' ) }
					</h4>
				</div>
				<p className="text-sm mt-2 ml-2">
					{ __( 'To display this block, the plugin will look for this template file in your theme:', 'genesis-custom-blocks' ) }
				</p>
				<p className="flex items-center w-auto text-xs font-mono mt-2 ml-2 px-2 py-1 bg-blue-200 rounded-sm">
					<span className="text-xs font-mono text-blue-800">{ template.templatePath }</span>
					<ClipboardCopy text={ template.templatePath } />
				</p>
				<div className="flex items-center mt-5 text-xs text-blue-800">
					<svg className="h-4 w-4 fill-current"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
							clipRule="evenodd"
						/>
					</svg>
					<p className="font-semibold ml-1">{ __( 'Learn more:', 'genesis-custom-blocks' ) }</p>
					<a
						className="underline ml-2"
						href={ urlBlockTemplates }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ __( 'Block Templates', 'genesis-custom-blocks' ) }
					</a>
					<a
						className="underline ml-2"
						href={ urlTemplateFunctions }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ __( 'Template Functions', 'genesis-custom-blocks' ) }
					</a>
				</div>
			</div>
	);
};

export default TopNotice;
