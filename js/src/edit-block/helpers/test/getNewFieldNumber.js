/**
 * Internal dependencies
 */
import getNewFieldNumber from '../getNewFieldNumber';

describe( 'getNewFieldNumber', () => {
	it.each( [
		[
			{
				'first-field': { name: 'first-field', label: 'First Field' },
			},
			null,
			null,
		],
		[
			{
				'new-field': { name: 'new-field', label: 'New Field' },
			},
			null,
			1,
		],
		[
			{
				'new-field': { name: 'new-field', label: 'New Field' },
				'new-field-1': { name: 'new-field-1', label: 'New Field 1' },
			},
			null,
			2,
		],
		[
			{
				'random-field': { name: 'random-field', label: 'A Different Field' },
				'new-field': { name: 'new-field', label: 'New Field' },
				'new-field-1': { name: 'new-field-1', label: 'New Field 1' },
				'new-field-2': { name: 'new-field-1', label: 'New Field 2' },
			},
			null,
			3,
		],
		[
			{
				'different-field-name': { name: 'different-field-name', label: 'A Different Field' },
				'baz-field': { name: 'baz-field', label: 'New Field' },
				'baz-field-1': { name: 'baz-field-1', label: 'New Field 1' },
				'baz-field-2': { name: 'baz-field-2', label: 'New Field 2' },
			},
			'baz-field',
			3,
		],
		[
			{
				'strange-field-name': { name: 'strange-field-name', label: 'A Strange Field' },
				'example-field': { name: 'example-field', label: 'New Field' },
				'example-field-1': { name: 'example-field-1', label: 'Example Field 1' },
				'example-field-2': { name: 'example-field-2', label: 'Example Field 2' },
				'example-field-3': { name: 'example-field-3', label: 'Example Field 3' },
			},
			'example-field',
			4,
		],
	] )( 'should get the field number if any',
		( fields, fieldName, expected ) => {
			const actual = fieldName
				? getNewFieldNumber( fields, fieldName )
				: getNewFieldNumber( fields );

			expect( actual ).toEqual( expected );
		}
	);
} );
