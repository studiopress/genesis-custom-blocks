/* global gcbEditor */

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { initializeEditor } from './helpers';
import { addControls } from '../block-editor/helpers';
import { GAClient } from '../common/classes';

// Renders the app in the container.
domReady( () => {
	let container = document.querySelector( 'body > div:first-child' );
	if ( ! container ) {
		container = document.querySelector( 'body' );
	}

	// @ts-ignore
	initializeEditor( gcbEditor, container );

	// @ts-ignore
	window.dataLayer = window.dataLayer || [];

	// @ts-ignore
	window.GcbAnalytics = {
		GAClient: new GAClient(),
	};
} );

addFilter( 'genesisCustomBlocks.controls', 'genesisCustomBlocks/addControls', addControls );
