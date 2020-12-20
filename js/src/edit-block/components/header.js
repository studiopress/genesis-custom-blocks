/**
 * External dependencies
 */
import * as React from 'react';

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
 * The header component.
 *
 * @return {React.ReactElement} The header.
 */
const Header = () => {
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
			<div id="save-and-publish">
				<span className="mr-3">
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
