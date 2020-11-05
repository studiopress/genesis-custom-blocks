/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import {
	useDispatch,
	useSelect,
} from '@wordpress/data';
import {
	EditorNotices,
	EditorProvider,
} from '@wordpress/editor';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BrowserURL, Header, Main, Side } from './';

/**
 * @typedef {Object} EditorSettingsProps The component props.
 * @property {number} postId The current post ID.
 * @property {string} postType The current post type.
 * @property {string} field The current field.
 * @property {Object} settings The editor settings.
 * @property {Object} initialEdits The initial edits, if any.
 */

/**
 * The migration admin page.
 *
 * @param {EditorSettingsProps} props The component props.
 * @return {React.ReactElement} The main editor component.
 */
const Editor = ( { postId, postType, settings, initialEdits } ) => {
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
				<EditorNotices />
				<Header />
				<div className="flex w-full h-0 flex-grow">
					<Main />
					<Side />
				</div>
			</EditorProvider>
		</div>
	);
};

export default Editor;
