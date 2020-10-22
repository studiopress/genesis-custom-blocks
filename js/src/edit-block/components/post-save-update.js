/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Animate, Button } from '@wordpress/components';
import { compose, usePrevious, useViewportMatch } from '@wordpress/compose';
import { useSelect, withDispatch, withSelect } from '@wordpress/data';
import { PostSwitchToDraftButton } from '@wordpress/editor';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, check, cloud, cloudUpload } from '@wordpress/icons';
import { displayShortcut } from '@wordpress/keycodes';

/**
 * Component showing whether the post is saved or not and providing save
 * buttons.
 * 
 * Forked from Gutenberg:
 * https://github.com/WordPress/gutenberg/blob/e61483bda071f69f3dddf4e34345d1278b6cdc6e/packages/editor/src/components/post-saved-state/index.js
 * This is forked because the Gutenberg component uses savePost(), which saves the 
 * edited blocks, not the post content.
 * This editor doesn't have blocks, just a JSON blob in the post content.
 *
 * @param {Object} props               Component props.
 * @param {?boolean} props.forceIsDirty  Whether to force the post to be marked
 * as dirty.
 * @param {?boolean} props.forceIsSaving Whether to force the post to be marked
 * as being saved.
 * @param {?boolean} props.showIconLabels Whether interface buttons show labels instead of icons
 * @return {import('@wordpress/element').WPComponent} The component.
 */
const PostSaveUpdate = ( {
	forceIsDirty,
	forceIsSaving,
	savePost,
	showIconLabels = false,
} ) => {
	const [ forceSavedMessage, setForceSavedMessage ] = useState( false );
	const isLargeViewport = useViewportMatch( 'small' );

	const {
		isAutosaving,
		isDirty,
		isNew,
		isPending,
		isPublished,
		isSaveable,
		isSaving,
		isScheduled,
		hasPublishAction,
	} = useSelect(
		( select ) => {
			const {
				isEditedPostNew,
				isCurrentPostPublished,
				isCurrentPostScheduled,
				isEditedPostDirty,
				isSavingPost,
				isEditedPostSaveable,
				getCurrentPost,
				isAutosavingPost,
				getEditedPostAttribute,
			} = select( 'core/editor' );

			return {
				isAutosaving: isAutosavingPost(),
				isDirty: forceIsDirty || isEditedPostDirty(),
				isNew: isEditedPostNew(),
				isPending: 'pending' === getEditedPostAttribute( 'status' ),
				isPublished: isCurrentPostPublished(),
				isSaving: forceIsSaving || isSavingPost(),
				isSaveable: isEditedPostSaveable(),
				isScheduled: isCurrentPostScheduled(),
				hasPublishAction:
					getCurrentPost()?.[ '_links' ]?.[ 'wp:action-publish' ] ??
					false,
			};
		},
		[ forceIsDirty, forceIsSaving ]
	);

	const wasSaving = usePrevious( isSaving );

	useEffect( () => {
		let timeoutId;

		if ( wasSaving && ! isSaving ) {
			setForceSavedMessage( true );
			timeoutId = setTimeout( () => {
				setForceSavedMessage( false );
			}, 1000 );
		}

		return () => clearTimeout( timeoutId );
	}, [ isSaving ] );

	if ( isSaving ) {
		// TODO: Classes generation should be common across all return
		// paths of this function, including proper naming convention for
		// the "Save Draft" button.
		const classes = classnames( 'editor-post-saved-state', 'is-saving', {
			'is-autosaving': isAutosaving,
		} );

		return (
			<Animate type="loading">
				{ ( { className: animateClassName } ) => (
					<span className={ classnames( classes, animateClassName ) }>
						<Icon icon={ cloud } />
						{ isAutosaving ? __( 'Autosaving' ) : __( 'Saving' ) }
					</span>
				) }
			</Animate>
		);
	}

	if ( isPublished || isScheduled ) {
		return <PostSwitchToDraftButton />;
	}

	if ( ! isSaveable ) {
		return null;
	}

	if ( forceSavedMessage || ( ! isNew && ! isDirty ) ) {
		return (
			<span className="editor-post-saved-state is-saved">
				<Icon icon={ check } />
				{ __( 'Saved' ) }
			</span>
		);
	}

	// Once the post has been submitted for review this button
	// is not needed for the contributor role.

	if ( ! hasPublishAction && isPending ) {
		return null;
	}

	/* translators: button label text should, if possible, be under 16 characters. */
	const label = isPending ? __( 'Save as pending' ) : __( 'Save draft' );

	/* translators: button label text should, if possible, be under 16 characters. */
	const shortLabel = __( 'Save' );

	if ( ! isLargeViewport ) {
		return (
			<Button
				className="editor-post-save-draft"
				label={ label }
				onClick={ () => savePost() }
				shortcut={ displayShortcut.primary( 's' ) }
				icon={ cloudUpload }
			>
				{ showIconLabels && shortLabel }
			</Button>
		);
	}

	return (
		<Button
			className="editor-post-save-draft"
			onClick={ () => savePost() }
			shortcut={ displayShortcut.primary( 's' ) }
			isTertiary
		>
			{ label }
		</Button>
	);
};

export default compose( [
	withSelect( ( select ) => {
		const {
			getCurrentPost,
			getCurrentPostId,
			getCurrentPostType,
			isEditedPostSaveable,
		} = select( 'core/editor' );
		const {
			getEditedEntityRecord,
			getEntityRecordNonTransientEdits,
			getLastEntitySaveError,
		} = select( 'core' );
		const { content } = getEditedEntityRecord( 'postType', getCurrentPostType(), getCurrentPostId() );

		return {
			editedContent: content,
			getCurrentPost,
			getEntityRecordNonTransientEdits,
			getLastEntitySaveError,
			isEditedPostSaveable
		};
	} ),
	withDispatch( 
		( dispatch, { 
			editedContent, 
			getCurrentPost, 
			getEntityRecordNonTransientEdits,
			getLastEntitySaveError,
			isEditedPostSaveable
		} ) => {
			const { saveEntityRecord } = dispatch( 'core' );
			const { editPost } = dispatch( 'core/editor' );

			const savePost = () => {
				if ( ! isEditedPostSaveable() ) {
					return;
				}

				let edits = {
					content: editedContent,
				};

				editPost( edits, { undoIgnore: true } );

				const previousRecord = getCurrentPost();

				edits = {
					id: previousRecord.id,
					...( getEntityRecordNonTransientEdits(
						'postType',
						previousRecord.type,
						previousRecord.id
					) ),
					...edits,
				};

				saveEntityRecord(
					'postType',
					previousRecord.type,
					edits
				);

				const error = getLastEntitySaveError(
					'postType',
					previousRecord.type,
					previousRecord.id
				);
			};

			return { savePost };
		}
	)
] )( PostSaveUpdate );
