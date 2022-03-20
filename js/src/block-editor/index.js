/* global genesisCustomBlocks, gcbBlocks */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { setLocaleData } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { addControls, registerBlocks } from './helpers';
import { Edit } from './components';

setLocaleData( { '': {} }, 'genesis-custom-blocks' );
addFilter( 'genesisCustomBlocks.controls', 'genesisCustomBlocks/addControls', addControls );

// @ts-ignore
registerBlocks( genesisCustomBlocks, gcbBlocks, Edit );
