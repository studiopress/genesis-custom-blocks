/**
 * Internal dependencies
 */
import { snakeCaseToPascalCase } from '../';

describe( 'snakeCaseToPascalCase', () => {
	it.each( [
		[ 'genesis_custom_blocks', 'GenesisCustomBlocks' ],
		[ 'account_balance', 'AccountBalance' ],
		[ 'brightness_2', 'Brightness2' ],
		[ 'flight', 'Flight' ],
		[ 'toggle_on', 'ToggleOn' ],
		[ '', '' ],
	] )( 'should be in PascalCase',
		( snakeCase, expected ) => {
			expect( snakeCaseToPascalCase( snakeCase ) ).toEqual( expected );
		}
	);
} );
