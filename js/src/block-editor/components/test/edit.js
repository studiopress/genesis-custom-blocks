/**
 * External dependencies
 */
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Edit } from '../';

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
	location,
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
} );
