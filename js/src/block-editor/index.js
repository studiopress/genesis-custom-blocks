/* global genesisCustomBlocks, gcbBlocks */

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import { addFilter } from '@wordpress/hooks';
import { setLocaleData } from '@wordpress/i18n';

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

	// @ts-ignore
	window.GcbAnalytics = {
		GAClient: new GAClient(),
	};
} );
