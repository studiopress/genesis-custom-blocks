/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { PostSavedState } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
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
	const isPostNew = useSelect( ( select ) => select( 'core/editor' ).isEditedPostNew() );
	const isPostDirty = useSelect( ( select ) => select( 'core/editor' ).isEditedPostDirty() );

	const fullBlock = getBlock( currentPost?.content );
	const blockNameWithNameSpace = getBlockNameWithNameSpace( fullBlock );
	const block = fullBlock[ blockNameWithNameSpace ] || {};

	// There's nothing entered or saved, so <ServerSideRender> would have an error.
	if ( isPostNew && ! isPostDirty ) {
		return (
			<p className="mt-4">
				{ __( 'Please add fields to the block to preview it.', 'genesis-custom-blocks' ) }
			</p>
		);
	}

	return (
		<>
			{
				isPostNew && isPostDirty
					? (
						<div className="mt-4 flex flex-row items-center">
							{ __( 'Please save your block to preview it:', 'genesis-custom-blocks' ) }
							&nbsp;
							<PostSavedState />
						</div>
					)
					: (
						<ServerSideRender
							block={ `genesis-custom-blocks/${ block?.name }` }
							attributes={ block?.previewAttributes }
							className="genesis-custom-blocks-editor__ssr"
							httpMethod="POST"
						/>
					)
			}
		</>
	);
};

export default FrontEndPreview;
