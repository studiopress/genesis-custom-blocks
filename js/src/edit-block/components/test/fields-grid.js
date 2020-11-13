/**
 * External dependencies
 */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { FieldsGrid } from '../../components';

const mockUrlField = {
	control: 'url',
	label: 'Url Example',
	location: 'editor',
	name: 'url-example',
	type: 'string',
};

const mockBlock = {
	name: 'testing-block',
	title: 'Testing Block',
	category: {
		icon: null,
		slug: 'text',
		title: 'Text',
	},
	icon: 'genesis_custom_blocks',
	keywords: [],
	excluded: [],
	fields: {
		[ mockUrlField.name ]: mockUrlField,
	},
};

jest.mock( '../../hooks/use-block', () => {
	return jest.fn( () => ( {
		block: mockBlock,
		changeBlock: jest.fn(),
	} ) );
} );

window.fetch = jest.fn();

describe( 'FieldsGrid', () => {
	it( 'displays the main editor area', async () => {
		const { getByText } = render( <FieldsGrid /> );

		expect( getByText( mockUrlField.name ) ).toBeInTheDocument();
		expect( getByText( mockUrlField.label ) ).toBeInTheDocument();
	} );
} );
