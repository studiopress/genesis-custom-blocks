/**
 * Internal dependencies
 */
import setCorrectOrderForFields from '../setCorrectOrderForFields';

describe( 'setCorrectOrderForFields', () => {
	it( 'should handle an empty array argument', () => {
		expect( setCorrectOrderForFields( [] ) ).toStrictEqual( [] );
	} );

	it( 'should set the correct order property for the fields', () => {
		expect( setCorrectOrderForFields( [
			{
				name: 'some_field_name',
				type: 'select',
				help: 'This is some example help text',
				location: 'editor',
				post_type: 'posts',
				width: '100',
				order: 0,
			},
			{
				name: 'example_field_name',
				type: 'textarea',
				default: 'Here is something',
				help: 'Here is the help text',
				location: 'editor',
				order: 2,
			},
			{
				name: 'example_radio',
				type: 'radio',
				help: 'Here is the help text',
				location: 'editor',
				order: 1,
			},
		] ) ).toStrictEqual( [
			{
				name: 'some_field_name',
				type: 'select',
				help: 'This is some example help text',
				location: 'editor',
				post_type: 'posts',
				width: '100',
				order: 0,
			},
			{
				name: 'example_field_name',
				type: 'textarea',
				default: 'Here is something',
				help: 'Here is the help text',
				location: 'editor',
				order: 1,
			},
			{
				name: 'example_radio',
				type: 'radio',
				help: 'Here is the help text',
				location: 'editor',
				order: 2,
			},
		] );
	} );
} );
