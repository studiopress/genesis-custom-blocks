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
