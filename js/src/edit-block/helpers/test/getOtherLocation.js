/**
 * Internal dependencies
 */
import getOtherLocation from '../getOtherLocation';

describe( 'getOtherLocation', () => {
	it.each( [
		[
			'editor',
			'inspector',
		],
		[
			'inspector',
			'editor',
		],
		[
			'',
			null,
		],
		[
			'is-not-a-location',
			null,
		],
	] )( 'should return the other location if the location is valid',
		( currentLocation, expected ) => {
			expect( getOtherLocation( currentLocation ) ).toEqual( expected );
		}
	);
} );
