/**
 * External dependencies
 */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { BlockPanel } from '../../components';

const mockBlock = {
	name: 'test-email',
	title: 'Test Email',
	category: {
		icon: null,
		slug: 'text',
		title: 'Text',
	},
	icon: 'genesis_custom_blocks',
	keywords: [],
	excluded: [],
	fields: {
		email: {},
	},
};

const mockCategories = [
	{
		slug: 'text',
		title: 'Text',
	},
	{
		slug: 'media',
		title: 'Media',
	},
	{
		slug: 'design',
		title: 'Design',
	},
	{
		slug: 'widgets',
		title: 'Widgets',
	},
	{
		slug: 'embed',
		title: 'Embeds',
	},
	{
		slug: 'reusable',
		title: 'Reusable blocks',
	},
	{
		icon: null,
		slug: 'New',
		title: 'New',
	},
];

global.gcbEditor = { categories: mockCategories };

jest.mock( '@wordpress/editor', () => ( {
	...jest.requireActual( '@wordpress/editor' ),
	PostTrash: () => <div>Trash</div>, // The original of this component makes a fetch request that causes an error.
} ) );

jest.mock( '../../hooks/useBlock', () => {
	return jest.fn( () => ( {
		block: mockBlock,
		changeBlock: jest.fn(),
	} ) );
} );

jest.mock( '@wordpress/api-fetch', () => {
	return jest.fn( () => {
		return Promise.resolve( {
			json: () => Promise.resolve( {} ),
		} );
	} );
} );

describe( 'BlockPanel', () => {
	it( 'displays the block panel', async () => {
		const { getAllByText, getByLabelText, getByText } = render(
			<BlockPanel />
		);

		getAllByText( /block/i );
		expect( getByText( /block settings/i ) ).toBeInTheDocument();
		expect( getByText( /slug/i ) ).toBeInTheDocument();
		expect( getByText( /keywords/i ) ).toBeInTheDocument();
		expect( getByText( /icon/i ) ).toBeInTheDocument();
		expect( getByLabelText( /category/i ) ).toBeInTheDocument();
		expect( getByLabelText( /keywords/i ) ).toBeInTheDocument();
		expect( getByText( /post types/i ) ).toBeInTheDocument();
	} );
} );
