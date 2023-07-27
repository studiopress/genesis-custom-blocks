/**
 * Internal dependencies
 */
import convertToSlug from '../convertToSlug';

describe( 'convertToSlug', () => {
	it.each( [
		[
			'Example',
			'example',
		],
		[
			'Two Words',
			'two-words',
		],
		[
			'Has Three Words',
			'has-three-words',
		],
		[
			'Has A Number 34',
			'has-a-number-34',
		],
		[
			'PascalCaseExample',
			'pascalcaseexample',
		],
		[
			'Multiple   Spaces',
			'multiple-spaces',
		],
		[
			'snake_case',
			'snake-case',
		],
	] )( 'should convert to the slug',
		( toConvert, expected ) => {
			expect( convertToSlug( toConvert ) ).toEqual( expected );
		}
	);
} );
