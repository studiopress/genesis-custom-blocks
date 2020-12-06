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
 * @param {string} control The name of the control, like 'text'.
 * @return {React.FunctionComponent|undefined} The icon component, if it exists.
 */
const getFieldIcon = ( control ) => {
	if ( ! control || 'string' !== typeof control ) {
		return null;
	}

	const icon = fieldIcons[ control ];
	return applyFilters( 'genesisCustomBlocks.getFieldIcon', icon, control );
};

export default getFieldIcon;
