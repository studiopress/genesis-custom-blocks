/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useEffect, useLayoutEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { EntityProvider } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { default as withRegistryProvider } from './with-registry-provider';

/**
 * @typedef {Object} EditorProviderProps The props of the component.
 * @property {Object} post The post for the editor.
 * @property {Object} settings The editor settings.
 * @property {boolean} recovery Whether this is a recovery.
 * @property {Object} initialEdits The initial edits, if any.
 * @property {React.ReactElement[]} children The component's children.
 */

/**
 * The editor provider, forked from Gutenberg.
 *
 * This is forked so we can remove the <BlockEditorProvider>.
 * That adds .blocks to the editedEntityRecord,
 * which causes getEditedPostContent() to return ''.
 *
 * @param {EditorProviderProps} props
 * @see https://github.com/WordPress/gutenberg/blob/60ad1e320436a55e74fb41cc1735301da187f61e/packages/editor/src/components/provider/index.js
 */
const EditorProvider = ( {
	post,
	settings,
	recovery,
	initialEdits,
	children,
} ) => {
	const {
		updatePostLock,
		setupEditor,
		updateEditorSettings,
	} = useDispatch( 'core/editor' );
	const { createWarningNotice } = useDispatch( noticesStore );

	// Iniitialize the editor.
	// Ideally this should be synced on each change and not just something you do once.
	useLayoutEffect( () => {
		// Assume that we don't need to initialize in the case of an error recovery.
		if ( recovery ) {
			return;
		}

		updatePostLock( settings.postLock );
		setupEditor( post, initialEdits, settings.template );
		if ( settings.autosave ) {
			createWarningNotice(
				__(
					'There is an autosave of this post that is more recent than the version below.'
				),
				{
					id: 'autosave-exists',
					actions: [
						{
							label: __( 'View the autosave' ),
							url: settings.autosave.editLink,
						},
					],
				}
			);
		}
	}, [ createWarningNotice, initialEdits, post, recovery, settings.autosave, settings.postLock, settings.template, setupEditor, updatePostLock ] );

	// Synchronize the editor settings as they change
	useEffect( () => {
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

export default withRegistryProvider( EditorProvider );
