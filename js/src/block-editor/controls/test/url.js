/**
 * External dependencies
 */
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import GcbURLControl from '../url';
import { setupControl } from './helpers';

/**
 * Gets the testing props.
 *
 * @return {Object} Testing props.
 */
const getProps = () => ( {
	field: {
		label: 'This is an example label',
		default: 'https://example.com/here-is-something',
	},
	onChange: jest.fn(),
} );

describe( 'url control', () => {
	it( 'displays the default value if no value is entered', () => {
		const props = getProps();
		const { control } = setupControl( GcbURLControl, props );

		expect( control.value ).toBe( props.field.default );
	} );

	it( 'sends the text that is entered to the onChange handler', () => {
		const props = getProps();
		const { control } = setupControl( GcbURLControl, props );
		const enteredUrl = 'https://example.com/baz';
		fireEvent.change( control, { target: { value: enteredUrl } } );

		expect( props.onChange ).toHaveBeenCalledWith( enteredUrl );
	} );
} );
