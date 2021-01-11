/**
 * External dependencies
 */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { FieldPanel } from '../../components';
import { FIELD_PANEL } from '../../constants';

const mockEmailField = {
	control: 'email',
	label: 'Email Example',
	location: 'editor',
	name: 'email-example',
	type: 'string',
};

jest.mock( '../../hooks/useField', () => {
	return jest.fn( () => ( {
		changeControl: jest.fn(),
		changeFieldSettings: jest.fn(),
		controls: mockControls,
		getField: () => mockEmailField,
		deleteField: () => jest.fn(),
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
	currentLocation: { name: emailField.name },
	isNewField: false,
	selectedField: { name: emailField.name },
	setCurrentLocation: jest.fn(),
	setIsNewField: jest.fn(),
	setSelectedField: jest.fn(),
} );

describe( 'FieldPanel', () => {
	it( 'displays the field panel with its sections', async () => {
		const { getAllByText, getByLabelText, getByText } = render(
			<FieldPanel { ...getProps() } panelDisplaying={ FIELD_PANEL } />
		);

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
		user.click( getByText( /delete/i ) );
	} );
} );
