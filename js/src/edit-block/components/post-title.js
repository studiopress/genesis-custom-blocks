/**
 * External dependencies
 */
import * as React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { VisuallyHidden } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { useBlock } from '../hooks';
import { convertToSlug } from '../helpers';

/**
 * Forked from Gutenberg, so this can have a prop of onBlur.
 *
 * @see https://github.com/WordPress/gutenberg/blob/d7e7561b7ea8128766f4f9f4150dc7c039c2cdeb/packages/editor/src/components/post-title/index.js
 *
 * @return {React.ReactElement} The post title editing area.
 */
const PostTitle = () => {
	const { block, changeBlock, changeBlockName } = useBlock();
	const instanceId = useInstanceId( PostTitle );
	const ref = useRef( null );
	const { editPost } = useDispatch( 'core/editor' );
	const {
		isCleanNewPost,
		title,
		placeholder,
	} = useSelect( ( select ) => {
		const {
			getEditedPostAttribute,
			isCleanNewPost: _isCleanNewPost,
		} = select( 'core/editor' );
		const { getSettings } = select( 'core/block-editor' );
		const {	titlePlaceholder } = getSettings();

		return {
			isCleanNewPost: _isCleanNewPost(),
			title: getEditedPostAttribute( 'title' ),
			placeholder: titlePlaceholder,
		};
	} );
	const [ isAutoSlugging, setIsAutoSlugging ] = useState( ! block || ! block.name );
	const [ isSelected, setIsSelected ] = useState( false );

	useEffect( () => {
		const { ownerDocument: { activeElement, body } } = ref.current;

		// Only autofocus the title when the post is entirely empty. This should
		// only happen for a new post, which means we focus the title on new
		// post so the author can start typing right away, without needing to
		// click anything.
		if ( isCleanNewPost &&
			( ! activeElement || body === activeElement )
		) {
			ref.current.focus();
		}
	}, [ isCleanNewPost ] );

	const onUpdate = ( newTitle ) => {
		if ( ! block.name ) {
			setIsAutoSlugging( true );
		}

		const newBlock = { title: newTitle };
		if ( isAutoSlugging || ! block.name ) {
			newBlock.name = convertToSlug( newTitle );
			changeBlockName( newTitle, newBlock );
		} else {
			changeBlock( newBlock );
		}

		editPost( { title: newTitle } );
	};

	const onSelect = () => {
		setIsSelected( true );
	};

	const onUnselect = () => {
		setIsSelected( false );
	};

	const onChange = ( event ) => {
		onUpdate( event.target.value );
	};

	const onBlur = () => {
		if ( block.name ) {
			setIsAutoSlugging( false );
		}
		onUnselect();
	};

	// The wp-block className is important for editor styles.
	// This same block is used in both the visual and the code editor.
	const className = classnames(
		'wp-block editor-post-title editor-post-title__block',
		{ 'is-selected': isSelected }
	);

	return (
		<div className={ className }>
			<VisuallyHidden
				as="label"
				htmlFor={ `post-title-${ instanceId }` }
			>
				{ placeholder || __( 'Add title', 'genesis-custom-blocks' ) }
			</VisuallyHidden>
			<TextareaAutosize
				ref={ ref }
				id={ `post-title-${ instanceId }` }
				className="editor-post-title__input"
				value={ title }
				onChange={ onChange }
				placeholder={ placeholder || __( 'Add title', 'genesis-custom-blocks' ) }
				onFocus={ onSelect }
				onBlur={ onBlur }
				onKeyPress={ onUnselect }
			/>
		</div>
	);
};

export default PostTitle;
