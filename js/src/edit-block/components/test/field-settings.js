/**
 * External dependencies
 */
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { FieldSettings } from '../../components';

const baseTextSettings = [
	{ name: 'location', label: 'Field Location', type: 'location', default: 'editor', help: '' },
	{ name: 'width', label: 'Field Width', type: 'width', default: '100', help: '' },
	{ name: 'help', label: 'Help Text', type: 'text', default: '', help: '' },
	{ name: 'default', label: 'Default Value', type: 'text', default: '', help: '' },
	{ name: 'placeholder', label: 'Placeholder Text', type: 'text', default: '', help: '' },
	{ name: 'maxlength', label: 'Character Limit', type: 'number_non_negative', default: '', help: '' },
];

describe( 'FieldSettings', () => {
	it( 'Text field has the right settings', () => {
		const field = {
			name: 'text',
			label: 'Text',
			control: 'text',
			type: 'string',
			order: 0,
		};

		const controls = {
			text: {
				label: 'Text',
				locations: { editor: 'Editor', inspector: 'Inspector' },
				name: 'text',
				settings: baseTextSettings,
			},
		};

		const { getByText, getByLabelText } = render( <FieldSettings controls={ controls } field={ field } /> );

		expect( getByText( 'Field Width' ) ).toBeInTheDocument();
		expect( getByLabelText( 'Help Text' ) ).toBeInTheDocument();
		expect( getByLabelText( 'Character Limit' ) ).toBeInTheDocument();
	} );

	it( 'Textarea field has the right settings', () => {
		const field = {
			name: 'textarea',
			label: 'Textarea',
			control: 'textarea',
			type: 'string',
			order: 2,
		};

		const controls = {
			textarea: {
				label: 'Textarea',
				locations: { editor: 'Editor', inspector: 'Inspector' },
				name: 'textarea',
				settings: [
					...baseTextSettings,
					{ name: 'number_rows', label: 'Number of Rows', type: 'number_non_negative', default: 4 },
					{ name: 'new_lines', label: 'New Lines', type: 'new_line_format', default: 'atop' },
				],
			},
		};

		const { getByText, getByLabelText } = render( <FieldSettings controls={ controls } field={ field } /> );

		expect( getByText( 'Field Width' ) ).toBeInTheDocument();
		expect( getByLabelText( 'Help Text' ) ).toBeInTheDocument();
		expect( getByLabelText( 'Character Limit' ) ).toBeInTheDocument();
		expect( getByLabelText( 'Number of Rows' ) ).toBeInTheDocument();
		expect( getByLabelText( 'New Lines' ) ).toBeInTheDocument();
	} );
} );
