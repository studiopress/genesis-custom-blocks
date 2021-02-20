/**
 * External dependencies
 */
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import GcbToggleControl from '../toggle';

test( 'toggle control', () => {
	const field = {
		label: 'Here is an example label',
		help: 'And here is help text',
		default: false,
	};
	const mockOnChange = jest.fn();

	const { getByLabelText, getByText } = render(
		<GcbToggleControl
			field={ field }
			getValue={ jest.fn() }
			onChange={ mockOnChange }
		/>
	);

	const toggle = getByLabelText( field.label );
	expect( toggle ).toBeInTheDocument();
	expect( getByText( field.help ) ).toBeInTheDocument();
	expect( toggle ).not.toBeChecked();

	userEvent.click( toggle );
	expect( mockOnChange ).toHaveBeenCalledWith( true );
} );
