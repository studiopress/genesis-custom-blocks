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
import { PreviewNotice } from './';
import { BUILDER_EDITING_MODE, EDITOR_PREVIEW_EDITING_MODE } from '../constants';
import { getBlock, getBlockNameWithNameSpace } from '../helpers';
import { useField } from '../hooks';
import { getFieldsAsArray } from '../../common/helpers';

/**
 * @typedef {Object} FrontEndPreviewProps The component props.
 * @property {import('./editor').SetEditorMode} setEditorMode Sets the editor mode.
 */

/**
 * The front-end preview of the block.
 *
 * Gets the saved post with .getCurrentPost(),
 * not the edited post.
 * The server side only has access to the saved post.
 * So there can be an error in <ServerSideRender>
 * if it passes attributes that aren't yet saved.
 *
 * @param {FrontEndPreviewProps} props
 * @return {React.ReactElement} The front-end preview.
 */
const FrontEndPreview = ( { setEditorMode } ) => {
	const currentPost = useSelect( ( select ) => select( 'core/editor' ).getCurrentPost() );
	const isPostNew = useSelect( ( select ) => select( 'core/editor' ).isEditedPostNew() );
	const isPostDirty = useSelect( ( select ) => select( 'core/editor' ).isEditedPostDirty() );
	const { getFields } = useField();

	const fullBlock = getBlock( currentPost?.content );
	const blockNameWithNameSpace = getBlockNameWithNameSpace( fullBlock );
	const block = fullBlock[ blockNameWithNameSpace ] || {};
	const fields = getFields();

	if ( ! getFieldsAsArray( fields ).length ) {
		return (
			<PreviewNotice>
				<button
					className="underline"
					onClick={ () => setEditorMode( BUILDER_EDITING_MODE ) }
				>
					{ __( 'Builder', 'genesis-custom-blocks' ) }
				</button>
			</PreviewNotice>
		);
	}

	if ( ! block.previewAttributes ) {
		return (
			<PreviewNotice>
				<button
					className="underline"
					onClick={ () => setEditorMode( EDITOR_PREVIEW_EDITING_MODE ) }
				>
					{ __( 'Editor Preview', 'genesis-custom-blocks' ) }
				</button>
			</PreviewNotice>
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
