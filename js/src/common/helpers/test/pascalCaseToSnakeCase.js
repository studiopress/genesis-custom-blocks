/**
 * Internal dependencies
 */
import { pascalCaseToSnakeCase } from '../';

describe( 'pascalCaseToSnakeCase', () => {
	it.each( [
		[ 'GenesisCustomBlocks', 'genesis_custom_blocks' ],
		[ 'AccountBalance', 'account_balance' ],
		[ 'Brightness2', 'brightness_2' ],
		[ 'Flight', 'flight' ],
		[ 'ToggleOn', 'toggle_on' ],
	] )( 'should be in snake_case',
		( pascalCase, expected ) => {
			expect( pascalCaseToSnakeCase( pascalCase ) ).toEqual( expected );
		}
	);
} );
