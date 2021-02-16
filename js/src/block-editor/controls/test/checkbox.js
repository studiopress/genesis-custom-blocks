/**
 * External dependencies
 */
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import GcbCheckboxControl from '../checkbox';

test( 'checkbox control', async () => {
	const field = {
		label: 'This is an example label',
		help: 'Here is help text for the checkbox field',
		default: false,
	};
	const mockOnChange = jest.fn();
	const { findByLabelText, findByRole, findByText } = render(
		<GcbCheckboxControl
			field={ field }
			getValue={ jest.fn() }
			onChange={ mockOnChange }
		/>
	);

	await findByLabelText( field.label );
	const checkbox = await findByRole( 'checkbox' );

	await findByText( field.help );
	expect( checkbox ).not.toBeChecked();

	user.click( checkbox );
	expect( mockOnChange ).toHaveBeenCalledWith( true );
} );
