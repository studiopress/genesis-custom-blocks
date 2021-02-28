/**
 * Internal dependencies
 */
import { LOCATIONS } from '../../common/constants';

/**
 * Gets the other location from the current one, if the current one is valid.
 *
 * For example, if the currentLocation is 'editor',
 * this will return 'inspector'.
 *
 * @param {string|null} currentLocation The current location, like 'editor'.
 */
const getOtherLocation = ( currentLocation ) => {
	const currentLocationIndex = LOCATIONS.indexOf( currentLocation );
	if ( -1 === currentLocationIndex ) {
		return null;
	}

	return LOCATIONS[ currentLocationIndex === 0 ? 1 : 0 ];
};

export default getOtherLocation;
