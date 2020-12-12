/**
 * Gets the edited post content.
 *
 * This is needed instead of the one in Gutenberg
 * because that will serialize blocks,
 * but this editor doesn't use blocks.
 * The GCB editor's post content is serialized JSON.
 *
 * @see https://github.com/WordPress/gutenberg/blob/60ad1e320436a55e74fb41cc1735301da187f61e/packages/editor/src/store/selectors.js#L994
 *
 * @param {Function} select The select function to access stores.
 * @return {string} The post content, if any.
 */
const getEditedPostContent = ( select ) => {
	const record = select( 'core' ).getEditedEntityRecord(
		'postType',
		select( 'core/editor' ).getCurrentPostType(),
		select( 'core/editor' ).getCurrentPostId()
	);

	return record && record.content ? record.content : '';
};

export default getEditedPostContent;
