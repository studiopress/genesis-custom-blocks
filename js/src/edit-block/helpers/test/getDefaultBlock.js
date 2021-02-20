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
			title: 'block',
			excluded: [],
			icon: 'genesis_custom_blocks',
			category: {
				icon: null,
				slug: 'text',
				title: 'Text',
			},
			keywords: [],
			fields: {},
		} );
	} );

	it( 'should get the default block with the post ID', () => {
		expect(
			getDefaultBlock( 923 )
		).toEqual( {
			name: 'block-923',
			title: 'block-923',
			excluded: [],
			icon: 'genesis_custom_blocks',
			category: {
				icon: null,
				slug: 'text',
				title: 'Text',
			},
			keywords: [],
			fields: {},
		} );
	} );
} );
