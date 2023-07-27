/**
 * Internal dependencies
 */
import convertSettingsArrayToString from '../convertSettingsArrayToString';

describe( 'convertSettingsArrayToString', () => {
	it.each( [
		[
			[
				{ value: 'foo', label: 'Foo' },
			],
			'foo : Foo',
		],
		[
			[
				{ value: 'foo: Foo', label: 'foo: Foo' },
			],
			'foo: Foo',
		],
		[
			[
				{ value: 'foo', label: 'Foo' }, { value: 'baz', label: 'Baz' },
			],
			'foo : Foo\nbaz : Baz',
		],
		[
			[
				{ value: ' foo', label: 'Foo ' }, { value: ' baz', label: 'Baz ' },
			],
			' foo : Foo \n baz : Baz ',
		],
		[
			[
				{ value: 'foo', label: 'foo' }, { value: 'baz', label: 'baz' },
			],
			'foo\nbaz',
		],
		[
			[
				{ value: 'foo@extralong%withmore(characters)', label: 'foo@extralong%withmore(characters)' },
				{ value: 'thisgoeslongerthanitnormallywould', label: 'thisgoeslongerthanitnormallywould' },
			],
			'foo@extralong%withmore(characters)\nthisgoeslongerthanitnormallywould',
		],
		[
			[
				{ value: 'b', label: 'b' },
			],
			'b',
		],
	] )( 'should convert the array',
		( toConvert, expected ) => {
			expect( convertSettingsArrayToString( toConvert ) ).toEqual( expected );
		}
	);
} );
