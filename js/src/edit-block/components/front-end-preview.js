/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import ServerSideRender from '@wordpress/server-side-render';

/**
 * @typedef {Object} FrontEndPreviewProps The header component props.
 * @property {string} blockName The name of the block, without the namespace.
 * @property {Object} previewAttributes The attributes to display in the preview.
 */

/**
 * The front-end previews of the block.
 *
 * @param {FrontEndPreviewProps} props
 * @return {React.ReactElement} The fields displayed in a grid.
 */
const FrontEndPreview = ( { blockName, previewAttributes } ) => {
	return (
		<ServerSideRender
			block={ `genesis-custom-blocks/${ blockName }` }
			attributes={ previewAttributes }
			className="genesis-custom-blocks-editor__ssr"
			httpMethod="POST"
		/>
	);
};

export default FrontEndPreview;
