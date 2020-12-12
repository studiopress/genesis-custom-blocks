/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useEffect, useLayoutEffect } from '@wordpress/element';
import { useDispatch  } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { EntityProvider } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { default as withRegistryProvider } from './with-registry-provider';

const EditorProvider = ( {
	__unstableTemplate,
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
		__experimentalTearDownEditor,
		__unstableSetupTemplate,
	} = useDispatch( editorStore );
	const { createWarningNotice } = useDispatch( noticesStore );

	// Iniitialize and tear down the editor.
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

		return () => {
			__experimentalTearDownEditor();
		};
	}, [] );

	// Synchronize the editor settings as they change
	useEffect( () => {
		updateEditorSettings( settings );
	}, [ settings ] );

	// Synchronize the template as it changes
	useEffect( () => {
		if ( __unstableTemplate ) {
			__unstableSetupTemplate( __unstableTemplate );
		}
	}, [ __unstableTemplate?.id ] );

	return (
		<EntityProvider kind="root" type="site">
			<EntityProvider kind="postType" type={ post.type } id={ post.id }>
				{ children }
			</EntityProvider>
		</EntityProvider>
	);
};

console.log( withRegistryProvider );
export default withRegistryProvider( EditorProvider );
