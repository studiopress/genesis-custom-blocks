/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import GcbFileControl from '../file';

jest.mock( '@wordpress/api-fetch', () => {
	return jest.fn( () => {
		return Promise.resolve( {
			json: () => Promise.resolve( {} ),
		} );
	} );
} );

jest.mock( '@wordpress/data/build/components/use-select', () =>
	() => () => {}
);

/**
 * Gets the props for the tested component.
 *
 * @return {Object} The props to pass to the component.
 */
const getProps = () => ( {
	field: {
		label: 'Here is a label',
		help: 'And here is some text',
	},
	getValue: jest.fn(),
	onChange: jest.fn(),
} );

test( 'file control', () => {
	const props = getProps();
	const { getByText } = render( <GcbFileControl { ...props } /> );

	expect( getByText( props.field.label ) ).toBeInTheDocument();
	expect( getByText( props.field.help ) ).toBeInTheDocument();
} );
