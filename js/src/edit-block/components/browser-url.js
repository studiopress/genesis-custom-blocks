/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Returns the Post's Edit URL.
 *
 * @param {number} postId Post ID.
 *
 * @return {string} Post edit URL.
 */
export function getPostEditURL( postId ) {
	return addQueryArgs( 'post.php', { post: postId, action: 'edit' } );
}

/**
 * Returns the post's Trashed URL.
 *
 * @param {number} postId   Post ID.
 * @param {string} postType Post Type.
 *
 * @return {string} Post trashed URL.
 */
export function getPostTrashedURL( postId, postType ) {
	return addQueryArgs( 'edit.php', {
		trashed: 1,
		post_type: postType,
		ids: postId,
	} );
}

/**
 * Forked from Gutenberg, with no change.
 *
 * @todo delete if Gutenberg ever exports this from the @wordpress/edit-post package.
 * @see https://github.com/WordPress/gutenberg/blob/78585d6935fee9020017d17383cef597b67c5703/packages/edit-post/src/components/browser-url/index.js
 */
export class BrowserURL extends Component {
	constructor() {
		// @ts-ignore
		super( ...arguments );

		this.state = {
			historyId: null,
		};
	}

	componentDidUpdate( prevProps ) {
		const { postId, postStatus, postType, isSavingPost } = this.props;
		const { historyId } = this.state;

		// Posts are still dirty while saving so wait for saving to finish
		// to avoid the unsaved changes warning when trashing posts.
		if ( postStatus === 'trash' && ! isSavingPost ) {
			this.setTrashURL( postId, postType );
			return;
		}

		if (
			( postId !== prevProps.postId || postId !== historyId ) &&
			postStatus !== 'auto-draft'
		) {
			this.setBrowserURL( postId );
		}
	}

	/**
	 * Navigates the browser to the post trashed URL to show a notice about the trashed post.
	 *
	 * @param {number} postId   Post ID.
	 * @param {string} postType Post Type.
	 */
	setTrashURL( postId, postType ) {
		window.location.href = getPostTrashedURL( postId, postType );
	}

	/**
	 * Replaces the browser URL with a post editor link for the given post ID.
	 *
	 * Note it is important that, since this function may be called when the
	 * editor first loads, the result generated `getPostEditURL` matches that
	 * produced by the server. Otherwise, the URL will change unexpectedly.
	 *
	 * @param {number} postId Post ID for which to generate post editor URL.
	 */
	setBrowserURL( postId ) {
		window.history.replaceState(
			{ id: postId },
			'Post ' + postId,
			getPostEditURL( postId )
		);

		this.setState( () => ( {
			historyId: postId,
		} ) );
	}

	render() {
		return null;
	}
}

export default withSelect( ( select ) => {
	const { getCurrentPost, isSavingPost } = select( 'core/editor' );
	const { id, status, type } = getCurrentPost();

	return {
		postId: id,
		postStatus: status,
		postType: type,
		isSavingPost: isSavingPost(),
	};
} )( BrowserURL );
