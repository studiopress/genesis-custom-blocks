/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import * as fieldIcons from '../icons';

/**
 * Gets the field icon component, if it exists.
 *
 * @param {string} controlName The name of the control, like 'text'.
 * @return {React.FunctionComponent|undefined} The icon component, if it exists.
 */
const getFieldIcon = ( controlName ) => {
	if ( ! controlName || 'string' !== typeof controlName ) {
		return null;
	}

	const icon = fieldIcons[ controlName ]; /* eslint-disable-line import/namespace */
	return applyFilters( 'genesisCustomBlocks.getFieldIcon', icon, controlName );
};

export default getFieldIcon;
