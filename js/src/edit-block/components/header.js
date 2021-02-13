/**
 * External dependencies
 */
import * as React from 'react';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	PostPublishButton,
	PostSavedState,
	EditorHistoryRedo,
	EditorHistoryUndo,
} from '@wordpress/editor';
import { Icon, wordpress } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
	BUILDER_EDITING_MODE,
	EDITOR_PREVIEW_EDITING_MODE,
	FRONT_END_PREVIEW_EDITING_MODE,
} from '../constants';

/**
 * @typedef {Object} HeaderProps The header component props.
 * @property {string} editorMode The display mode.
 * @property {function(string):void} setEditorMode Changes the editor mode.
 */

/**
 * The header component.
 *
 * @param {HeaderProps} props
 * @return {React.ReactElement} The header.
 */
const Header = ( { editorMode, setEditorMode } ) => {
	const buttonClasses = 'flex items-center h-12 px-4 text-sm focus:outline-none';
	const backURL = addQueryArgs( 'edit.php', {
		post_type: 'genesis_custom_block',
	} );

	return (
		<div className="flex items-center h-16 border-b border-gray-300 w-full">
			<a
				className="flex items-center justify-center h-full w-16 bg-gray-900 text-white"
				href={ backURL }
				aria-label={ __( 'Go back to WordPress', 'genesis-custom-blocks' ) }
			>
				<Icon className="fill-current" icon={ wordpress } size={ 36 } />
			</a>
			<EditorHistoryUndo />
			<EditorHistoryRedo />
			<button
				className={ classNames(
					buttonClasses,
					{ 'font-semibold': BUILDER_EDITING_MODE === editorMode }
				) }
				onClick={ () => {
					setEditorMode( BUILDER_EDITING_MODE );
				} }
			>
				<span>{ __( 'Builder', 'genesis-custom-blocks' ) }</span>
			</button>
			<button
				className={ classNames(
					buttonClasses,
					{ 'font-semibold': EDITOR_PREVIEW_EDITING_MODE === editorMode }
				) }
				onClick={ () => {
					setEditorMode( EDITOR_PREVIEW_EDITING_MODE );
				} }
			>
				<span>{ __( 'Editor Preview', 'genesis-custom-blocks' ) }</span>
			</button>
			<button
				className={ classNames(
					buttonClasses,
					{ 'font-semibold': FRONT_END_PREVIEW_EDITING_MODE === editorMode }
				) }
				onClick={ () => {
					setEditorMode( FRONT_END_PREVIEW_EDITING_MODE );
				} }
			>
				<span>{ __( 'Front-end Preview', 'genesis-custom-blocks' ) }</span>
			</button>
			<div id="save-and-publish">
				<span className="mr-3 text-sm">
					<PostSavedState
						forceIsDirty={ false }
						forceIsSaving={ false }
					/>
				</span>
				<span className="mr-3">
					<PostPublishButton />
				</span>
			</div>
		</div>
	);
};

export default Header;
