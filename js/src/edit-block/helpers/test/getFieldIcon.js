/**
 * Internal dependencies
 */
import getFieldIcon from '../getFieldIcon';

describe( 'getFieldIcon', () => {
	it.each( [
		'checkbox',
		'email',
		'select',
		'text',
	] )( 'should have the field icon component',
		( fieldName ) => {
			expect( typeof getFieldIcon( fieldName ) ).toEqual( 'object' );
		}
	);

	it( 'should not have an icon that does not exist', () => {
		expect( getFieldIcon( 'nonexistent_name' ) ).toEqual( undefined );
	} );
} );
