/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { Placeholder } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { PostPublishButton } from '@wordpress/editor';
import { useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * @typedef {Object} FrontEndPreviewProps The header component props.
 * @property {string} blockName The name of the block, without the namespace.
 * @property {Object} previewAttributes The attributes to display in the preview.
 */

/**
 * @typedef {Object} ErrorResponsePlaceholderProps The header component props.
 * @property {Object} response The response from the endpoint.
 * @property {string} className The class name to display.
 */

/**
 * Forked from @wordpress/server-side-render.
 *
 * @see https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/server-side-render/src/server-side-render.js#L33
 *
 * @param {ErrorResponsePlaceholderProps} props
 * @return {React.ReactElement} The error placeholder.
 */
const ErrorResponsePlaceholder = ( { response, className } ) => {
	const isEditedPostDirty = useSelect( ( select ) => select( 'core/editor' ).isEditedPostDirty() );

	const errorMessage = sprintf(
		// translators: %s: error message describing the problem
		__( 'Error loading block: %s.' ),
		response.errorMsg
	);
	return (
		<Placeholder className={ className }>
			{ errorMessage }
			{
				isEditedPostDirty
					? (
						<>
							&nbsp;
							{ __( 'Clicking here might prevent it:', 'genesis-custom-blocks' ) }
							&nbsp;
							<PostPublishButton />
						</>
					)
					: null
			}
		</Placeholder>
	);
};

/**
 * The front-end previews of the block.
 *
 * @param {FrontEndPreviewProps} props
 * @return {React.ReactElement} The front-end preview.
 */
const FrontEndPreview = ( { blockName, previewAttributes } ) => {
	const isEditedPostDirty = useSelect( ( select ) => select( 'core/editor' ).isEditedPostDirty() );

	useEffect( () => {}, [ isEditedPostDirty ] );

	return (
		<ServerSideRender
			block={ `genesis-custom-blocks/${ blockName }` }
			attributes={ previewAttributes }
			className="genesis-custom-blocks-editor__ssr"
			httpMethod="POST"
			ErrorResponsePlaceholder={ ErrorResponsePlaceholder }
		/>
	);
};

export default FrontEndPreview;
