/**
 * External dependencies
 */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Side } from '../../components';

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
		email: {
			control: 'email',
			label: 'Email Example',
			location: 'editor',
			name: 'email-example',
			type: 'string',
		},
	},
};

jest.mock( '@wordpress/data/build/components/use-select', () => {
	return jest.fn( () => {
		return JSON.stringify( {
			'genesis-custom-blocks/email-example': mockBlock,
		} );
	} );
} );

const locationSetting = { name: 'location', label: 'Field Location', type: 'location', default: 'editor', help: '' };
const widthSetting = { name: 'width', label: 'Field Width', type: 'width', default: '100', help: '' };
const helpSetting = { name: 'help', label: 'Help Text', type: 'text', default: '', help: '' };
const defaultSetting = { name: 'default', label: 'Default Value', type: 'text', default: '', help: '' };
const placeholderSetting = { name: 'placeholder', label: 'Placeholder Text', type: 'text', default: '', helpSetting: '' };
const maxlengthSetting = { name: 'maxlength', label: 'Character Limit', type: 'number_non_negative', default: '', helpSetting: '' };

global.gcbEditor = {
	controls: {
		email: {
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
		},
	},
};
window.fetch = jest.fn();

describe( 'Side', () => {
	it( 'has the right settings for text', () => {
		const { getAllByText, getByText } = render( <Side /> );

		getAllByText( /block/i );
		getAllByText( /field/i );
		expect( getByText( 'Block Settings' ) ).toBeInTheDocument();
	} );
} );
