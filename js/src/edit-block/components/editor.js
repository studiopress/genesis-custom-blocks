/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import {
	EditorNotices,
	EditorProvider,
	ErrorBoundary,
} from '@wordpress/editor';
import { StrictMode, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BrowserURL, Header, Main, Side } from './';

/**
 * @callback onErrorType Handler for errors.
 * @return {void}
 */

/**
 * @typedef {Object} EditorSettingsProps The component props.
 * @property {Object|null} initialEdits The initial edits, if any.
 * @property {onErrorType} onError Handler for errors.
 * @property {number} postId The current post ID.
 * @property {string} postType The current post type.
 * @property {Object} settings The editor settings.
 */

/**
 * The editor component.
 *
 * @param {EditorSettingsProps} props The component props.
 * @return {React.ReactElement} The editor.
 */
const Editor = ( { initialEdits, onError, postId, postType, settings } ) => {
	const post = useSelect(
		( select ) => select( 'core' ).getEntityRecord( 'postType', postType, postId ),
		[ postId, postType ]
	);
	// @ts-ignore
	const { editEntityRecord } = useDispatch( 'core' );

	// A hack to remove blocks from the edited entity.
	// The stores use getEditedPostContent(), which gets the blocks if the .blocks property exists.
	// This change makes getEditedPostContent() return the post content, instead of
	// parsing [] blocks and returning ''.
	useEffect( () => {
		if ( ! post ) {
			return;
		}

		editEntityRecord(
			'postType',
			postType,
			postId,
			{ blocks: null }
		);
	}, [ editEntityRecord, post, postId, postType ] );

	if ( ! post ) {
		return null;
	}

	return (
		<StrictMode>
			<div className="h-screen flex flex-col items-center text-black">
				<BrowserURL />
				<EditorProvider
					settings={
						{
							...settings,
							richEditingEnabled: false,
						}
					}
					post={ post }
					initialEdits={ initialEdits }
					useSubRegistry={ false }
				>
					<ErrorBoundary onError={ onError }>
						<EditorNotices />
						<Header />
						<div className="flex w-full h-0 flex-grow">
							<Main />
							<Side />
						</div>
					</ErrorBoundary>
				</EditorProvider>
			</div>
		</StrictMode>
	);
};

export default Editor;
