/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
// @ts-ignore type declaration not available
import { EntityProvider } from '@wordpress/core-data';
// @ts-ignore type declaration not available
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { useEditor } from '../hooks';

/**
 * @typedef {Object} EditorProviderProps The props of the component.
 * @property {Object} post The post for the editor.
 * @property {Object} settings The editor settings.
 * @property {React.ReactElement} children The component's children.
 */

/**
 * The editor provider, forked from Gutenberg.
 *
 * This is forked so we can remove the <BlockEditorProvider>.
 * That adds .blocks to the editedEntityRecord,
 * which causes getEditedPostContent() to return ''.
 *
 * @see https://github.com/WordPress/gutenberg/blob/60ad1e320436a55e74fb41cc1735301da187f61e/packages/editor/src/components/provider/index.js
 * @param {EditorProviderProps} props
 */
const EditorProvider = ( {
	post,
	settings,
	children,
} ) => {
	const { setupEditor } = useEditor();
	const {
		updatePostLock,
		updateEditorSettings,
	} = useDispatch( 'core/editor' );
	// @ts-ignore type declaration not available
	const { createWarningNotice } = useDispatch( noticesStore );

	// Iniitialize the editor.
	// Ideally this should be synced on each change and not just something you do once.
	React.useLayoutEffect( () => {
		updatePostLock( settings.postLock );
		setupEditor( post );
		if ( settings.autosave ) {
			createWarningNotice(
				__( 'There is an autosave of this post that is more recent than the version below.', 'genesis-custom-blocks' ),
				{
					id: 'autosave-exists',
					actions: [
						{
							label: __( 'View the autosave', 'genesis-custom-blocks' ),
							url: settings.autosave.editLink,
						},
					],
				}
			);
		}
	}, [] ); /* eslint-disable-line react-hooks/exhaustive-deps */

	// Synchronize the editor settings as they change
	React.useEffect( () => {
		updateEditorSettings( settings );
	}, [ settings, updateEditorSettings ] );

	return (
		<EntityProvider kind="root" type="site">
			<EntityProvider kind="postType" type={ post.type } id={ post.id }>
				{ children }
			</EntityProvider>
		</EntityProvider>
	);
};

export default EditorProvider;
