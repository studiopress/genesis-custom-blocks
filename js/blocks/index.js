/* global genesisCustomBlocks, gcbBlocks */

/**
 * WordPress dependencies
 */
import { setLocaleData } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { addControls, registerBlocks } from './helpers';
import { Edit } from './components';

setLocaleData( { '': {} }, 'genesis-custom-blocks' );
addFilter( 'genesisCustomBlocks.controls', 'genesisCustomBlocks/addControls', addControls );
registerBlocks( genesisCustomBlocks, gcbBlocks, Edit );
