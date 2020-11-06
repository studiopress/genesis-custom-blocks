/**
 * Internal dependencies
 */
import { getSettingsComponent } from '../';

global.gcbEditor = { controls: {} };

describe( 'getSettingsComponent', () => {
	it.each( [
		[ 'checkbox', 'Checkbox' ],
		[ 'location', 'Location' ],
		[ 'new_line_format', 'NewLineFormat' ],
		[ 'number_non_negative', 'NumberNonNegative' ],
		[ 'number', 'Number' ],
		[ 'text', 'Text' ],
		[ 'textarea', 'Textarea' ],
		[ 'textarea_array', 'TextareaArray' ],
		[ 'width', 'Width' ],
	] )( 'should have the setting',
		( settingName, expected ) => {
			expect( getSettingsComponent( settingName ).name ).toEqual( expected );
		}
	);

	it( 'should not have a setting that does not exist', () => {
		expect( getSettingsComponent( 'does-not-exist' ) ).toEqual( null );
	} );
} );
