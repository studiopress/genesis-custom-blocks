/**
 * External dependencies
 */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { FieldSettings } from '../../components';

const locationSetting = { name: 'location', label: 'Field Location', type: 'location', default: 'editor', help: '' };
const widthSetting = { name: 'width', label: 'Field Width', type: 'width', default: '100', help: '' };
const helpSetting = { name: 'help', label: 'Help Text', type: 'text', default: '', help: '' };
const defaultSetting = { name: 'default', label: 'Default Value', type: 'text', default: '', help: '' };
const placeholderSetting = { name: 'placeholder', label: 'Placeholder Text', type: 'text', default: '', helpSetting: '' };
const maxlengthSetting = { name: 'maxlength', label: 'Character Limit', type: 'number_non_negative', default: '', helpSetting: '' };

const baseTextSettings = [
	locationSetting,
	widthSetting,
	helpSetting,
	defaultSetting,
	placeholderSetting,
	maxlengthSetting,
];

global.gcbEditor = { controls: {} };

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

		expect( getByText( widthSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( helpSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( maxlengthSetting.label ) ).toBeInTheDocument();
	} );

	it( 'Textarea field has the right settings', () => {
		const field = {
			name: 'textarea',
			label: 'Textarea',
			control: 'textarea',
			type: 'string',
			order: 2,
		};

		const numberrowsSetting = { name: 'number_rows', label: 'Number of Rows', type: 'number_non_negative', default: 4 };
		const newLinesSetting = { name: 'new_lines', label: 'New Lines', type: 'new_line_format', default: 'atop' };
		const controls = {
			textarea: {
				label: 'Textarea',
				locations: { editor: 'Editor', inspector: 'Inspector' },
				name: 'textarea',
				settings: [
					...baseTextSettings,
					numberrowsSetting,
					newLinesSetting,
				],
			},
		};

		const { getByText, getByLabelText } = render( <FieldSettings controls={ controls } field={ field } /> );

		expect( getByText( widthSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( helpSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( maxlengthSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( numberrowsSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( newLinesSetting.label ) ).toBeInTheDocument();
	} );

	it( 'Multiselect field has the right settings', () => {
		const field = {
			name: 'multiselect',
			label: 'Multiselect',
			control: 'multiselect',
			type: 'string',
			order: 4,
		};

		const choicesSetting = { name: 'options', label: 'Choices', type: 'textarea_array', default: '', help: 'Enter each choice on a new line. To specify the value and label separately, use this format:<br />foo : Foo<br />bar : Bar' };
		const multiselectDefaultSetting = { name: 'default', label: 'Default Value', type: 'textarea_array', default: 'Enter each default value on a new line.' };
		const controls = {
			multiselect: {
				label: 'Multiselect',
				locations: { editor: 'Editor', inspector: 'Inspector' },
				name: 'multiselect',
				settings: [
					locationSetting,
					widthSetting,
					helpSetting,
					choicesSetting,
					multiselectDefaultSetting,
				],
			},
		};

		const { getByText, getByLabelText } = render( <FieldSettings controls={ controls } field={ field } /> );

		expect( getByText( locationSetting.label ) ).toBeInTheDocument();
		expect( getByText( widthSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( helpSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( choicesSetting.label ) ).toBeInTheDocument();
		expect( getByLabelText( multiselectDefaultSetting.label ) ).toBeInTheDocument();
	} );
} );
