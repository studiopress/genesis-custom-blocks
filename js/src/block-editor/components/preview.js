/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import ServerSideRender from '@wordpress/server-side-render';
import { applyFilters } from '@wordpress/hooks';

/**
 * @typedef AlternatePreviewProps An alternate preview component.
 * @property {string} blockName The block's name, starting with the namespace of genesis-custom-blocks/.
 * @property {Object} attributes The block attributes.
 */

/**
 * @typedef {Object} PreviewProps
 * @property {string} blockName The block name, without the namespace of genesis-custom-blocks/.
 * @property {Object} attributes The block attributes.
 */

/**
 * The Edit function for the block.
 *
 * @param {PreviewProps} props
 * @return {React.ReactElement} The preview of the block.
 */
const Preview = ( { blockName, attributes } ) => {
	const blockNameWithNamespace = `genesis-custom-blocks/${ blockName }`;

	/** @type {React.FunctionComponent<AlternatePreviewProps>| null} */
	// @ts-ignore The type of applyFilters() is unknown.
	const AlternatePreview = applyFilters(
		'genesisCustomBlocks.alternatePreview',
		null,
		blockNameWithNamespace,
		attributes
	);

	return (
		!! AlternatePreview
			? (
				<AlternatePreview
					blockName={ blockNameWithNamespace }
					attributes={ attributes }
				/>
			) : (
				<ServerSideRender
					block={ blockNameWithNamespace }
					attributes={ attributes }
					className="genesis-custom-blocks-editor__ssr"
					httpMethod="POST"
				/>
			)
	);
};

export default Preview;
