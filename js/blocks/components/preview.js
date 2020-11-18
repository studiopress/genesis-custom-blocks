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
	const AlternatePreview = applyFilters(
		'genesisCustomBlocks.alternatePreview',
		null,
		blockName,
		attributes
	);

	return (
		!! AlternatePreview
			? <AlternatePreview
				blockName={ blockName }
				attributes={ attributes }
			/>
			: <ServerSideRender
				block={ `genesis-custom-blocks/${ blockName }` }
				attributes={ attributes }
				className="genesis-custom-blocks-editor__ssr"
				httpMethod="POST"
			/>
	);
};

export default Preview;
