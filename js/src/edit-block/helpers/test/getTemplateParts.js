/**
 * Internal dependencies
 */
import getTemplateParts from '../getTemplateParts';

describe( 'getTemplateParts', () => {
	it.each( [
		[
			'wp-content/themes/twentytwentyone-child/blocks/block-baz-block.php',
			[
				'wp-content/themes/twentytwentyone-child/blocks/',
				'block-baz-block.php',
			],
		],
		[
			'wp-content/plugins/best-ever/blocks/block-here-is-a-block.php',
			[
				'wp-content/plugins/best-ever/blocks/',
				'block-here-is-a-block.php',
			],
		],
		[
			'block-baz-block.php',
			[
				'',
				'block-baz-block.php',
			],
		],

		[
			'',
			[
				'',
				'',
			],
		],
	] )( 'should get the template parts',
		( templatePath, expected ) => {
			expect( getTemplateParts( templatePath ) ).toEqual( expected );
		}
	);
} );
