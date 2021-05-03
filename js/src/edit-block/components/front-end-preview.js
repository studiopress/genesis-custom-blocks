/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import { getBlock, getBlockNameWithNameSpace } from '../helpers';

/**
 * The front-end preview of the block.
 *
 * Gets the saved post with .getCurrentPost(),
 * not the edited post.
 * The server side only has access to the saved post.
 * So there can be an error in <ServerSideRender>
 * if it passes attributes that aren't yet saved.
 *
 * @return {React.ReactElement} The front-end preview.
 */
const FrontEndPreview = () => {
	const currentPost = useSelect( ( select ) => select( 'core/editor' ).getCurrentPost() );
	const fullBlock = getBlock( currentPost?.content );
	const blockNameWithNameSpace = getBlockNameWithNameSpace( fullBlock );
	const block = fullBlock[ blockNameWithNameSpace ] || {};

	return (
		<ServerSideRender
			block={ `genesis-custom-blocks/${ block?.name }` }
			attributes={ block?.previewAttributes }
			className="genesis-custom-blocks-editor__ssr"
			httpMethod="POST"
		/>
	);
};

export default FrontEndPreview;
