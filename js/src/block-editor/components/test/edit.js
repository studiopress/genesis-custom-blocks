/**
 * External dependencies
 */
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { Edit } from '../';

jest.mock( '@wordpress/data/build/components/use-select', () =>
	jest.fn( () => false )
);

const getRangeField = ( location = 'editor' ) => ( {
	location,
	width: 100,
	help: 'This is help text',
	min: 0,
	max: 100,
	step: 1,
	default: undefined,
	name: 'range',
	label: 'Range',
	order: 0,
	control: 'range',
	type: 'integer',
} );

const getBlock = ( location = 'editor' ) => ( {
	name: 'test-range',
	title: 'Test Range',
	excluded: [],
	icon: 'genesis_custom_blocks',
	category: {
		icon: null,
		slug: 'text',
		title: 'Text',
	},
	keywords: [],
	fields: {
		range: getRangeField( location ),
	},
	displayModal: false,
} );

describe( 'Edit', () => {
	it( 'displays the block form with a GCB field when an editor field exists', () => {
		render(
			<Edit
				block={ getBlock() }
				blockProps={ { isSelected: true } }
			/>
		);

		expect( screen.getByLabelText( /gcb block form/i ) ).toBeInTheDocument();
		expect( screen.getByText( getBlock().title ) ).toBeInTheDocument();
	} );

	it( 'does not display the block form when no editor field exists', () => {
		render(
			<Edit
				block={ getBlock( 'inspector' ) }
				blockProps={ { isSelected: true } }
			/>
		);

		expect( screen.queryByLabelText( /gcb block form/i ) ).not.toBeInTheDocument();
		expect( screen.queryByText( getBlock().title ) ).not.toBeInTheDocument();
	} );

	it( 'does not display the block form when set to display in the modal', () => {
		render(
			<Edit
				block={ {
					...getBlock(),
					displayModal: true,
				} }
				blockProps={ { isSelected: true } }
			/>
		);

		expect( screen.queryByLabelText( /gcb block form/i ) ).not.toBeInTheDocument();
		expect( screen.queryByText( getBlock().title ) ).not.toBeInTheDocument();

		// Open the modal.
		user.click( screen.getByLabelText( /edit the block/i ) );

		expect( screen.getByLabelText( /gcb block form/i ) ).toBeInTheDocument();
		screen.getAllByText( getBlock().title );

		act( () => {
			user.click( screen.getByLabelText( /close dialog/i ) );
		} );

		expect( screen.queryByLabelText( /gcb block form/i ) ).not.toBeInTheDocument();
		expect( screen.queryByText( getBlock().title ) ).not.toBeInTheDocument();
	} );
} );
