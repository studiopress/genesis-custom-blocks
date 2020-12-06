/**
 * Internal dependencies
 */
import { getFieldIcon } from '../';

describe( 'getFieldIcon', () => {
	it.each( [
		'checkbox',
		'email',
		'select',
		'text',
	] )( 'should have the field component',
		( fieldName ) => {
			expect( typeof getFieldIcon( fieldName ) ).toEqual( 'object' );
		}
	);

	it( 'should not have an icon that does not exist', () => {
		expect( getFieldIcon( 'nonexistent_name' ) ).toEqual( undefined );
	} );
} );
