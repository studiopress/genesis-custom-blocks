/**
 * Internal dependencies
 */
import { getDefaultBlock } from '../';

describe( 'getDefaultBlock', () => {
	it( 'should get the default block without the post ID', () => {
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

	it( 'should get the default block with the post ID', () => {
		expect(
			getDefaultBlock( 923 )
		).toEqual( {
			name: 'block-923',
			category: {
				icon: null,
				slug: 'text',
				title: 'Text',
			},
			icon: 'genesis_custom_blocks',
		} );
	} );
} );
