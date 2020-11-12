/**
 * Internal dependencies
 */
import { getIconComponent } from '../';

global.gcbEditor = { controls: {} };

describe( 'getIconComponent', () => {
	it.each( [
		[ 'genesis_custom_blocks', 'GenesisCustomBlocks' ],
		[ 'account_balance', 'AccountBalance' ],
		[ 'brightness_2', 'Brightness2' ],
		[ 'flight', 'Flight' ],
		[ 'toggle_on', 'ToggleOn' ],
	] )( 'should have the setting',
		( settingName, expected ) => {
			expect( getIconComponent( settingName ).name ).toEqual( expected );
		}
	);

	it( 'should not have an icon that does not exist', () => {
		expect( getIconComponent( 'does_not_exist' ) ).toEqual( null );
	} );
} );
