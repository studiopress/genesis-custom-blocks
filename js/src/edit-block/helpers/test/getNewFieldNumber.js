/**
 * Internal dependencies
 */
import { getNewFieldNumber } from '../';

describe( 'getNewFieldNumber', () => {
	it.each( [
		[
			{
				'first-field': { name: 'first-field', label: 'First Field' },
			},
			null,
		],
		[
			{
				'new-field': { name: 'new-field', label: 'New Field' },
			},
			1,
		],
		[
			{
				'new-field': { name: 'new-field', label: 'New Field' },
				'new-field-1': { name: 'new-field-1', label: 'New Field 1' },
			},
			2,
		],
		[
			{
				'random-field': { name: 'random-field', label: 'A Different Field' },
				'new-field': { name: 'new-field', label: 'New Field' },
				'new-field-1': { name: 'new-field-1', label: 'New Field 1' },
				'new-field-2': { name: 'new-field-1', label: 'New Field 1' },
			},
			3,
		],
	] )( 'should get the field number if any',
		( fields, expected ) => {
			expect( getNewFieldNumber( fields ) ).toEqual( expected );
		}
	);
} );
