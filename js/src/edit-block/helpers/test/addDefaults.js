/**
 * Internal dependencies
 */
import { addDefaults } from '../';

describe( 'addDefaults', () => {
	it.each( [
		[
			{},
			{ apple: '', orange: '' },
			{ apple: '', orange: '' },
		],
		[
			{ apple: 'ap' },
			{ apple: '', orange: '' },
			{ apple: 'ap', orange: '' },
		],
		[
			{ apple: 'ap', orange: 'or' },
			{ apple: '', orange: '' },
		],

	] )( 'should add defaults when properties do not exist',
		( initial, defaults, expected = null ) => {
			expect( addDefaults( initial, defaults ) ).toEqual( expected ? expected : initial );
		}
	);
} );
