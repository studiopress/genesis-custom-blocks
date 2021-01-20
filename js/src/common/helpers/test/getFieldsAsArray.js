/**
 * Internal dependencies
 */
import { getFieldsAsArray } from '../';

describe( 'getFieldsAsArray', () => {
	it( 'should handle an argument of an empty object', () => {
		expect( getFieldsAsArray( {} ) ).toStrictEqual( [] );
	} );

	it( 'should return fields as an array for a typical object of fields', () => {
		expect( getFieldsAsArray( {
			example_post: {
				name: 'example_post',
				type: 'post',
				help: 'This is some example help text',
				location: 'editor',
				post_type: 'posts',
				width: '100',
				order: 2,
			},
			example_classic_text: {
				name: 'example_classic_text',
				type: 'classic_text',
				default: 'https://example.com/go-here',
				help: 'Here is the help text',
				location: 'editor',
				order: 1,
			},
			example_user: {
				name: 'example_user',
				type: 'user',
				default: 'https://example.com/go-here',
				help: 'Here is the help text',
				location: 'inspector',
				order: 0,
			},
		} ) ).toStrictEqual( [
			{
				name: 'example_user',
				type: 'user',
				default: 'https://example.com/go-here',
				help: 'Here is the help text',
				location: 'inspector',
				order: 0,
			},
			{
				name: 'example_classic_text',
				type: 'classic_text',
				default: 'https://example.com/go-here',
				help: 'Here is the help text',
				location: 'editor',
				order: 1,
			},
			{
				name: 'example_post',
				type: 'post',
				help: 'This is some example help text',
				location: 'editor',
				post_type: 'posts',
				width: '100',
				order: 2,
			},
		] );
	} );

	it( 'should still include falsy values in the simplified fields', () => {
		expect( getFieldsAsArray( {
			test_taxonomy: {
				name: 'test_taxonomy',
				default: '',
			},
		} ) ).toStrictEqual( [
			{
				name: 'test_taxonomy',
				default: '',
			},
		] );
	} );
} );
