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

describe( 'FieldSettings', () => {
	it( 'has the label', () => {
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
				settings: [
					{ name: 'location', label: 'Field Location', type: 'location', default: 'editor', help: '' },
					{ name: 'width', label: 'Field Width', type: 'width', default: '100', help: '' },
					{ name: 'help', label: 'Help Text', type: 'text', default: '', help: '' },
					{ name: 'default', label: 'Default Value', type: 'text', default: '', help: '' },
					{ name: 'placeholder', label: 'Placeholder Text', type: 'text', default: '', help: '' },
					{ name: 'maxlength', label: 'Character Limit', type: 'number_non_negative', default: '', help: '' },
				],
			},
		};

		const { getByText, getByLabelText } = render( <FieldSettings controls={ controls } field={ field } /> );

		expect( getByText( 'Field Width' ) ).toBeInTheDocument();
		expect( getByLabelText( 'Help Text' ) ).toBeInTheDocument();
	} );
} );
