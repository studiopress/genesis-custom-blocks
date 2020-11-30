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
import { DEFAULT_LOCATION } from '../constants';
import { getDefaultBlock } from '../helpers';
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
	const { block, changeBlockName } = useBlock();
	const [ selectedFieldName, setSelectedFieldName ] = useState( '' );
	const [ currentLocation, setCurrentLocation ] = useState( DEFAULT_LOCATION );

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
		if ( isSavingPost && ! block.name ) {
			const defaultBlock = getDefaultBlock( postId );
			changeBlockName( defaultBlock.name, defaultBlock );
		}
	}, [ block, changeBlockName, isSavingPost, postId ] );

	useEffect( () => {
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
	}, [ editEntityRecord, post, postId, postType ] );

	if ( ! post ) {
		return null;
	}

	return (
		<StrictMode>
			<div className="h-screen flex flex-col items-center text-black">
				<BrowserURL />
				<EditorProvider
					settings={ settings }
					post={ post }
					initialEdits={ initialEdits }
					useSubRegistry={ false }
				>
					<ErrorBoundary onError={ onError }>
						<EditorNotices />
						<Header />
						<div className="flex w-full h-0 flex-grow">
							<Main
								currentLocation={ currentLocation }
								selectedFieldName={ selectedFieldName }
								setCurrentLocation={ setCurrentLocation }
								setSelectedFieldName={ setSelectedFieldName }
							/>
							<Side
								selectedFieldName={ selectedFieldName }
								setCurrentLocation={ setCurrentLocation }
							/>
						</div>
					</ErrorBoundary>
				</EditorProvider>
			</div>
		</StrictMode>
	);
};

export default Editor;
