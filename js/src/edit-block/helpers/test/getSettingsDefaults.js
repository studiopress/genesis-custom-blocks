/**
 * Internal dependencies
 */
import { getSettingsDefaults } from '../';

const getControls = () => ( {
	textarea: {
		label: 'Textarea',
		locations: { editor: 'Editor', inspector: 'Inspector' },
		name: 'textarea',
		settings: [
			{ name: 'location', label: 'Field Location', type: 'location', default: 'editor', help: '', value: null },
			{ name: 'width', label: 'Field Width', type: 'width', default: '100', help: '', value: null },
			{ name: 'help', label: 'Help Text', type: 'text', default: '', help: '', value: null },
			{ name: 'default', label: 'Default Value', type: 'textarea', default: '', help: '', value: null },
			{ name: 'placeholder', label: 'Placeholder Text', type: 'text', default: '', help: '', value: null },
			{ name: 'maxlength', label: 'Character Limit', type: 'number_non_negative', default: '', help: '', value: null },
			{ name: 'number_rows', label: 'Number of Rows', type: 'number_non_negative', default: 4, help: '', value: null },
			{ name: 'new_lines', label: 'New Lines', type: 'new_line_format', default: 'autop', help: '', value: null },
		],
		type: 'string',
	},
} );

describe( 'getSettingsDefaults', () => {
	it.each( [
		[ 'textarea', { location: 'editor', width: '100', help: '', default: '', placeholder: '', maxlength: '', number_rows: 4, new_lines: 'autop' } ],
		[ 'does_not_exist', {} ],
	] )( 'should have the settings defaults if the setting exists',
		( controlName, expected ) => {
			expect( getSettingsDefaults( controlName, getControls() ) ).toEqual( expected );
		}
	);
} );
