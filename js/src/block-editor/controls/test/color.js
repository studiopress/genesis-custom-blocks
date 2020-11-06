/**
 * External dependencies
 */
import { fireEvent, render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import GcbColorControl from '../color';

test( 'color control', async () => {
	const field = {
		default: '#bef5cb',
		help: 'This is some help text',
		label: 'This is an example label',
	};
	const mockOnChange = jest.fn();
	const { findByText, getByRole } = render(
		<GcbColorControl
			field={ field }
			getValue={ jest.fn() }
			onChange={ mockOnChange }
			instanceId="7e8f32c1-f1dd-3151"
		/>
	);
	const input = getByRole( 'textbox' );

	expect( input.value ).toBe( field.default );
	await findByText( field.help );
	await findByText( field.label );

	// On entering a new color, it should be sent to the onChange handler.
	const enteredColor = '#fff';
	fireEvent.change( input, { target: { value: enteredColor } } );
	expect( mockOnChange ).toHaveBeenCalledWith( enteredColor );
} );
