/**
 * Internal dependencies
 */
import { getFieldsAsObject } from '../';

describe( 'getFieldsAsObject', () => {
	it( 'should handle an argument of an empty array', () => {
		expect( getFieldsAsObject( [] ) ).toStrictEqual( {} );
	} );

	it( 'should return the fields as an object when passed a typical array of fields', () => {
		expect( getFieldsAsObject(
			[
				{
					name: 'testing-select',
					type: 'string',
					control: 'select',
					help: 'This is a select field',
					location: 'editor',
					width: '50',
				},
				{
					name: 'testing-multiselect',
					type: 'array',
					control: 'multiselect',
					default: 'https://example.com/go-here',
					help: 'This is help for a multiselect',
					location: 'inspector',
				},
				{
					name: 'radio',
					type: 'string',
					help: 'Here is a radio control',
					location: 'editor',
					width: '50',
				},
			]
		) ).toStrictEqual(
			{
				'testing-select': {
					name: 'testing-select',
					type: 'string',
					control: 'select',
					help: 'This is a select field',
					location: 'editor',
					width: '50',
					order: 0,
				},
				'testing-multiselect': {
					name: 'testing-multiselect',
					type: 'array',
					control: 'multiselect',
					default: 'https://example.com/go-here',
					help: 'This is help for a multiselect',
					location: 'inspector',
					order: 1,
				},
				radio: {
					name: 'radio',
					type: 'string',
					help: 'Here is a radio control',
					location: 'editor',
					width: '50',
					order: 2,
				},
			}
		);
	} );

	it( 'should still include falsy values in the fields', () => {
		expect( getFieldsAsObject( [
			{
				name: 'test_radio',
				default: '',
			},
		] ) ).toStrictEqual( {
			test_radio: {
				name: 'test_radio',
				default: '',
				order: 0,
			},
		} );
	} );
} );
