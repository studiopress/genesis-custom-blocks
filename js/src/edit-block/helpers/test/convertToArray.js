/**
 * Internal dependencies
 */
import { convertSettingsStringToArray } from '../';

describe( 'convertSettingsStringToArray', () => {
	it.each( [
		[
			'foo : Foo',
			[
				{ value: 'foo', label: 'Foo' },
			],
		],
		[
			'foo: Foo',
			[
				{ value: 'foo: Foo', label: 'foo: Foo' },
			],
		],
		[
			'foo : Foo\nbaz : Baz',
			[
				{ value: 'foo', label: 'Foo' }, { value: 'baz', label: 'Baz' } ],
		],
		[
			' foo : Foo \n baz : Baz ',
			[
				{ value: ' foo', label: 'Foo ' }, { value: ' baz', label: 'Baz ' },
			],
		],
		[
			'foo\nbaz',
			[
				{ value: 'foo', label: 'foo' }, { value: 'baz', label: 'baz' },
			],
		],
		[
			'b',
			[
				{ value: 'b', label: 'b' },
			],
		],
		[
			'foo@extralong%withmore(characters)\nthisgoeslongerthanitnormallywould',
			[
				{ value: 'foo@extralong%withmore(characters)', label: 'foo@extralong%withmore(characters)' },
				{ value: 'thisgoeslongerthanitnormallywould', label: 'thisgoeslongerthanitnormallywould' },
			],
		],
	] )( 'should convert %s to the value',
		( toConvert, expected ) => {
			expect( convertSettingsStringToArray( toConvert ) ).toEqual( expected );
		}
	);
} );
