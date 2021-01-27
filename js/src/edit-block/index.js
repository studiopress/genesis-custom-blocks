/* global gcbEditor */

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import { initializeEditor } from './helpers';

// Renders the app in the container.
domReady( () => {
	let container = document.querySelector( 'body > div:first-child' );
	if ( ! container ) {
		container = document.querySelector( 'body' );
	}

	// @ts-ignore
	initializeEditor( gcbEditor, container );
} );
