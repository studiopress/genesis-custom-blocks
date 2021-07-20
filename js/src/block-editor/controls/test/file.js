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
	jest.fn( () => false )
);

// @todo: remove this when the console warning no longer appears.
// Expected mock function not to be called but it was called with:
// ["wp.components.DropZoneProvider is deprecated. Note: wp.component.DropZone no longer needs a provider. wp.components.DropZoneProvider is safe to remove from your code."]
// Core still has an older components file, so removing the provider now crashes the editor.
console.warn = jest.fn(); /* eslint-disable-line no-console */

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
