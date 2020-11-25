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
import { StrictMode, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BrowserURL, Header, Main, Side } from './';
import { useBlock } from '../hooks';

/**
 * @callback onErrorType Handler for errors.
 * @return {void}
 */

/**
 * @typedef {Object} EditorProps The component props.
 * @property {Object|null} initialEdits The initial edits, if any.
 * @property {onErrorType} onError Handler for errors.
 * @property {number} postId The current post ID.
 * @property {string} postType The current post type.
 * @property {Object} settings The editor settings.
 */

/**
 * The editor component.
 *
 * @param {EditorProps} props The component props.
 * @return {React.ReactElement} The editor.
 */
const Editor = ( { initialEdits, onError, postId, postType, settings } ) => {
	const { block, changeBlock, changeBlockName } = useBlock();
	const [ selectedFieldName, setSelectedFieldName ] = useState( '' );
	const post = useSelect(
		( select ) => select( 'core' ).getEntityRecord( 'postType', postType, postId ),
		[ postId, postType ]
	);
	const isSavingPost = useSelect(
		( select ) => select( 'core/editor' ).isSavingPost()
	);

	// @ts-ignore
	const { editEntityRecord } = useDispatch( 'core' );

	useEffect( () => {
		const defaultBlock = {
			name: 'block',
			category: {
				icon: null,
				slug: 'text',
				title: 'Text',
			},
			icon: 'genesis_custom_blocks',
		};

		if ( isSavingPost && ! block.name ) {
			changeBlockName( defaultBlock.name, defaultBlock );
		}

		if ( ! post ) {
			return;
		}

		// A hack to remove blocks from the edited entity.
		// The stores use getEditedPostContent(), which gets the blocks if the .blocks property exists.
		// This change makes getEditedPostContent() return the post content, instead of
		// parsing [] blocks and returning ''.
		editEntityRecord(
			'postType',
			postType,
			postId,
			{ blocks: null }
		);
	}, [
		block,
		changeBlock,
		changeBlockName,
		editEntityRecord,
		isSavingPost,
		post,
		postId,
		postType,
	] );

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
							<Main setSelectedFieldName={ setSelectedFieldName }	/>
							<Side selectedFieldName={ selectedFieldName } />
						</div>
					</ErrorBoundary>
				</EditorProvider>
			</div>
		</StrictMode>
	);
};

export default Editor;
