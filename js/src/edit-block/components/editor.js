// @ts-check

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { EntityProvider } from '@wordpress/core-data';
import { PostSavedState, PostTitle } from '@wordpress/editor';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { Fields } from './';

/**
 * The migration admin page.
 *
 * @return {React.ReactElement} The main editor component.
 */
const Editor = () => {
	return (
		<EntityProvider
			kind="root"
			type="postType"
			id={ `gcb-editor` }
		>
			<PostTitle />
			<PostSavedState />
			<Fields />
		</EntityProvider>
	);
};

export default withSelect( ( select, { postId, postType } ) => {
	const { getEntityRecord } = select( 'core' );

	return {
		post: getEntityRecord( 'postType', postType, postId ),
	};
} )( Editor );
