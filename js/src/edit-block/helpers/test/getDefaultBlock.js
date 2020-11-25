/**
 * Internal dependencies
 */
import { getDefaultBlock } from '../';

describe( 'getDefaultBlock', () => {
	it( 'should get the default block', () => {
		expect(
			getDefaultBlock()
		).toEqual( {
			name: 'block',
			category: {
				icon: null,
				slug: 'text',
				title: 'Text',
			},
			icon: 'genesis_custom_blocks',
		} );
	} );
} );
