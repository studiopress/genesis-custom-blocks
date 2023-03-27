/**
 * Internal dependencies
 */
import hasRepeaterField from '../hasRepeaterField';

describe( 'hasRepeaterField', () => {
	it( 'should handle an argument of an empty object', () => {
		expect( hasRepeaterField( {} ) ).toStrictEqual( false );
	} );

	it( 'should be false when there is no repeater', () => {
		expect( hasRepeaterField( {
			example_multiselect: {
				control: 'multiselect',
				help: 'Select the type here',
				location: 'editor',
				width: '100',
				order: 0,
			},
			example_select: {
				control: 'select',
				help: 'Here are some more options',
				location: 'inspector',
				order: 1,
			},
			example_color: {
				control: 'color',
				help: 'Here is a color you can choose',
				location: 'editor',
				order: 2,
			},
		} ) ).toStrictEqual( false );
	} );

	it( 'should be true when there is a repeater', () => {
		expect( hasRepeaterField( {
			example_multiselect: {
				control: 'multiselect',
				help: 'Select the type here',
				location: 'editor',
				width: '100',
				order: 0,
			},
			example_repeater: {
				control: 'repeater',
				help: 'Here are some more options',
				location: 'editor',
				order: 1,
			},
			example_color: {
				control: 'color',
				help: 'Here is a color you can choose',
				location: 'editor',
				order: 2,
			},
		} ) ).toStrictEqual( true );
	} );
} );
