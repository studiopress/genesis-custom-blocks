/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import GcbInnerBlocksControl from '../inner-blocks';

/**
 * Gets the props for the component.
 *
 * @return {Object} The props.
 */
const getProps = () => ( {
	field: {
		label: 'Here is a label for InnerBlocks',
		help: 'This is some help text',
	},
	onChange: jest.fn(),
	context: 'edit-block',
} );

test( 'inner-blocks control', () => {
	const props = getProps();
	render( <GcbInnerBlocksControl { ...props } /> );
	screen.getByText( props.field.help );
	screen.getByText( props.field.label );
	expect( screen.getByText( 'This field only works in the block editor.' ) ).toBeInTheDocument();
} );
