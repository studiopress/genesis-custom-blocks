/* global genesisCustomBlocks, gcbBlocks */

/**
 * WordPress dependencies
 */
import { setLocaleData } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import { addControls, registerBlocks } from './helpers';
import { Edit } from './components';
import { GAClient } from '../common/classes';

setLocaleData( { '': {} }, 'genesis-custom-blocks' );
addFilter( 'genesisCustomBlocks.controls', 'genesisCustomBlocks/addControls', addControls );

// @ts-ignore
registerBlocks( genesisCustomBlocks, gcbBlocks, Edit );

domReady( () => {
	// @ts-ignore
	window.dataLayer = window.dataLayer || [];

	// Assigns an instantiated class (Singleton pattern) to the Window global object.
	// @ts-ignore
	window.GcbAnalytics = {
		GAClient: new GAClient(),
	};
} );
