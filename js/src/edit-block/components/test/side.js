/**
 * External dependencies
 */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Side } from '../../components';
import { BLOCK_PANEL, FIELD_PANEL } from '../../constants';

const mockEmailField = {
	control: 'email',
	label: 'Email Example',
	location: 'editor',
	name: 'email-example',
	type: 'string',
};

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
		email: mockEmailField,
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

jest.mock( '../../hooks/useBlock', () => {
	return jest.fn( () => ( {
		block: mockBlock,
		changeBlock: jest.fn(),
	} ) );
} );

jest.mock( '../../hooks/useCategories', () => {
	return jest.fn( () => ( {
		categories: mockCategories,
		setCategories: jest.fn(),
	} ) );
} );

jest.mock( '../../hooks/useField', () => {
	return jest.fn( () => ( {
		controls: mockControls,
		changeControl: jest.fn(),
		changeFieldSettings: jest.fn(),
		getField: () => mockEmailField,
	} ) );
} );

jest.mock( '@wordpress/api-fetch', () => {
	return jest.fn( () => {
		return Promise.resolve( {
			json: () => Promise.resolve( {} ),
		} );
	} );
} );

const locationSetting = { name: 'location', label: 'Field Location', type: 'location', default: 'editor', help: '' };
const widthSetting = { name: 'width', label: 'Field Width', type: 'width', default: '100', help: '' };
const helpSetting = { name: 'help', label: 'Help Text', type: 'text', default: '', help: '' };
const defaultSetting = { name: 'default', label: 'Default Value', type: 'text', default: '', help: '' };
const placeholderSetting = { name: 'placeholder', label: 'Placeholder Text', type: 'text', default: '', helpSetting: '' };
const maxlengthSetting = { name: 'maxlength', label: 'Character Limit', type: 'number_non_negative', default: '', helpSetting: '' };

const emailField = {
	label: 'Email',
	locations: { editor: 'Editor', inspector: 'Inspector' },
	name: 'email',
	settings: [
		locationSetting,
		widthSetting,
		helpSetting,
		defaultSetting,
		placeholderSetting,
		maxlengthSetting,
	],
};
const mockControls = {
	email: emailField,
};

const getProps = () => ( {
	setPanelDisplaying: jest.fn(),
	selectedField: emailField.name,
	setCurrentLocation: jest.fn(),
	setSelectedField: jest.fn(),
} );

describe( 'Side', () => {
	it( 'displays the block panel', async () => {
		const { getAllByText, getByLabelText, getByText } = render(
			<Side { ...getProps() } panelDisplaying={ BLOCK_PANEL } />
		);

		getAllByText( /block/i );
		getAllByText( /field/i );

		// Initially, the 'Block' panel should display.
		expect( getByText( /block settings/i ) ).toBeInTheDocument();
		expect( getByText( /slug/i ) ).toBeInTheDocument();
		expect( getByText( /keywords/i ) ).toBeInTheDocument();
		expect( getByText( /icon/i ) ).toBeInTheDocument();
		expect( getByLabelText( /category/i ) ).toBeInTheDocument();
		expect( getByLabelText( /keywords/i ) ).toBeInTheDocument();
		expect( getByText( /post types/i ) ).toBeInTheDocument();
	} );

	it( 'displays the panels with their sections', async () => {
		const { getAllByText, getByLabelText, getByText } = render(
			<Side { ...getProps() } panelDisplaying={ FIELD_PANEL } />
		);

		getAllByText( /block/i );
		getAllByText( /field/i );

		expect( getByText( /field settings/i ) ).toBeInTheDocument();
		expect( getByLabelText( /field label/i ) ).toBeInTheDocument();
		expect( getByText( 'Field Name (slug)' ) ).toBeInTheDocument();
		expect( getByText( locationSetting.label ) ).toBeInTheDocument();
		expect( getByText( widthSetting.label ) ).toBeInTheDocument();
		expect( getByText( helpSetting.label ) ).toBeInTheDocument();
		expect( getByText( defaultSetting.label ) ).toBeInTheDocument();
		expect( getByText( placeholderSetting.label ) ).toBeInTheDocument();
		expect( getByText( maxlengthSetting.label ) ).toBeInTheDocument();
	} );
} );
