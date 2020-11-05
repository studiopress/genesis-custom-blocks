// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { render, unmountComponentAtNode } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Editor } from '../components';

/**
 * Reinitializes the editor after the user chooses to reboot the editor after
 * an unhandled error occurs, replacing previously mounted editor element using
 * an initial state from prior to the crash.
 *
 * Forked from Gutenberg.
 * https://github.com/WordPress/gutenberg/blob/e61483bda071f69f3dddf4e34345d1278b6cdc6e/packages/edit-post/src/index.js
 *
 * @param {Object}  postType     Post type of the post to edit.
 * @param {Object}  postId       ID of the post to edit.
 * @param {Element} target       DOM node in which editor is rendered.
 * @param {?Object} settings     Editor settings object.
 * @param {Object}  initialEdits Programmatic edits to apply initially, to be
 *                               considered as non-user-initiated (bypass for
 *                               unsaved changes prompt).
 */
export function reinitializeEditor(
	postType,
	postId,
	target,
	settings,
	initialEdits
) {
	unmountComponentAtNode( target );
	const reboot = reinitializeEditor.bind(
		null,
		postType,
		postId,
		target,
		settings,
		initialEdits
	);

	render(
		<Editor
			settings={ settings }
			onError={ reboot }
			postId={ postId }
			postType={ postType }
			initialEdits={ initialEdits }
		/>,
		target
	);
}

/**
 * Initializes the editor.
 *
 * Forked from Gutenberg.
 *
 * @param {Object} gcbEditor The initial controls to filter.
 * @param {Object} container The initial controls to filter.
 */
const initializeEditor = (
	gcbEditor,
	container
) => {
	const {
		postType,
		postId,
		settings,
		initialEdits,
	} = gcbEditor;

	const reboot = reinitializeEditor.bind(
		null,
		postType,
		postId,
		container,
		settings,
		initialEdits
	);

	// Show a console log warning if the browser is in 'Quirks' mode.
	if ( 'Quirks' === document.compatMode ) {
		// eslint-disable-next-line no-console
		console.warn(
			"Your browser is using Quirks Mode. \nThis can cause rendering issues such as blocks overlaying meta boxes in the editor. Quirks Mode can be triggered by PHP errors or HTML code appearing before the opening <!DOCTYPE html>. Try checking the raw page source or your site's PHP error log and resolving errors there, removing any HTML before the doctype, or disabling plugins."
		);
	}

	// This is a temporary fix for a couple of issues specific to Webkit on iOS.
	// Without this hack the browser scrolls the mobile toolbar off-screen.
	// Once supported in Safari we can replace this in favor of preventScroll.
	// For details see issue #18632 and PR #18686
	// Specifically, we scroll `interface-interface-skeleton__body` to enable a fixed top toolbar.
	// But Mobile Safari forces the `html` element to scroll upwards, hiding the toolbar.
	const isIphone = window.navigator.userAgent.indexOf( 'iPhone' ) !== -1;
	if ( isIphone ) {
		window.addEventListener( 'scroll', ( event ) => {
			const editorScrollContainer = document.getElementsByClassName(
				'interface-interface-skeleton__body'
			)[ 0 ];
			if ( event.target === document ) {
				// Scroll element into view by scrolling the editor container by the same amount
				// that Mobile Safari tried to scroll the html element upwards.
				if ( window.scrollY > 100 ) {
					editorScrollContainer.scrollTop =
						editorScrollContainer.scrollTop + window.scrollY;
				}
				// Undo unwanted scroll on html element, but only in the visual editor.
				if (
					document.getElementsByClassName( 'is-mode-visual' )[ 0 ]
				) {
					window.scrollTo( 0, 0 );
				}
			}
		} );
	}

	render(
		<Editor
			settings={ settings }
			onError={ reboot }
			postId={ postId }
			postType={ postType }
			initialEdits={ initialEdits }
		/>,
		container
	);
};

export default initializeEditor;
