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
import { debounce } from '../common/helpers';
import { GAClient } from '../common/classes';

// Renders the app in the container.
domReady( () => {
	let container = document.querySelector( 'body > div:first-child' );
	if ( ! container ) {
		container = document.querySelector( 'body' );
	}

	// @ts-ignore
	initializeEditor( gcbEditor, container );
} );

addFilter( 'genesisCustomBlocks.controls', 'genesisCustomBlocks/addControls', addControls );

// @ts-ignore
window.dataLayer = window.dataLayer || [];

// Assigns an instantiated class (Singleton pattern) to the Window global object.
// @ts-ignore
window.GcbAnalytics = {
	debounce,
	GAClient: new GAClient(),
};
