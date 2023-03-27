/**
 * Internal dependencies
 */
import getBlock from '../getBlock';

describe( 'getBlock', () => {
	it.each( [
		[
			'non-JSON string',
			{},
		],
		[
			'{"example":"Example here"}',
			{ example: 'Example here' },
		],
		[
			'{"genesis-custom-blocks/test-email":{"name":"test-email","title":"Test Email","category":{"icon":null,"slug":"text","title":"Text"},"icon":"genesis_custom_blocks","keywords":[],"excluded":[],"fields":{"email":{}}}}',
			{
				'genesis-custom-blocks/test-email': {
					name: 'test-email',
					title: 'Test Email',
					category: {
						icon: null,
						slug: 'text',
						title: 'Text',
					},
					icon: 'genesis_custom_blocks',
					keywords: [],
					excluded: [],
					fields: {
						email: {},
					},
				},
			},
		],
	] )( 'should return a populated object if passed valid JSON',
		( postContent, expected ) => {
			expect( getBlock( postContent ) ).toEqual( expected );
		}
	);
} );
