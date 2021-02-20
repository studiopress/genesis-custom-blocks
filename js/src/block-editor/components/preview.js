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
 * @property {string} blockName The block's name.
 * @property {Object} attributes The block attributes.
 */

/**
 * @typedef {Object} PreviewProps
 * @property {string} blockName The block name, without the namespace.
 * @property {Object} attributes The block attributes.
 */

/**
 * The Edit function for the block.
 *
 * @param {PreviewProps} props
 * @return {React.ReactElement} The preview of the block.
 */
const Preview = ( { blockName, attributes } ) => {
	/**
	 * The alternate preview component, if any.
	 *
	 * @param {AlternatePreviewProps} props The props for the alternate preview.
	 * @return {React.FunctionComponent|null} The alternate preview, if any.
	 */
	const AlternatePreview = applyFilters(
		'genesisCustomBlocks.alternatePreview',
		null,
		blockName,
		attributes
	);

	return (
		!! AlternatePreview
			? (
				<AlternatePreview
					blockName={ blockName }
					attributes={ attributes }
				/>
			) : (
				<ServerSideRender
					block={ `genesis-custom-blocks/${ blockName }` }
					attributes={ attributes }
					className="genesis-custom-blocks-editor__ssr"
					httpMethod="POST"
				/>
			)
	);
};

export default Preview;
