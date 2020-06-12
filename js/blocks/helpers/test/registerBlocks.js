/**
 * Internal dependencies
 */
import { registerBlocks } from '../';

const mockRegisterBlockType = jest.fn();
jest.mock( '@wordpress/blocks', () => {
	return {
		registerBlockType: ( ...args ) => mockRegisterBlockType( ...args ),
	};
} );
const Edit = () => {};
const expectedArgs = {
	title: expect.any( String ),
	category: expect.any( String ),
	icon: expect.any( String ),
	keywords: expect.any( Array ),
	attributes: expect.any( Object ),
	edit: expect.any( Function ),
	save: expect.any( Function ),
};

describe( 'registerBlocks', () => {
	it( 'should not register any block if there is no Genesis Custom Blocks block passed', () => {
		registerBlocks( {}, {}, Edit );
		expect( mockRegisterBlockType ).toHaveBeenCalledTimes( 0 );
	} );

	it( 'should register a single block', () => {
		const blockName = 'genesis-custom-blocks/test-post';
		const gcbBlocks = {};
		gcbBlocks[ blockName ] = {
			title: 'Test Post',
			category: 'widget',
			keywords: [ 'foobaz', 'example' ],
		};

		registerBlocks( {}, gcbBlocks, Edit );
		expect( mockRegisterBlockType ).toHaveBeenCalledWith(
			blockName,
			expect.objectContaining( expectedArgs )
		);
	} );

	it( 'should register two blocks', () => {
		registerBlocks(
			{},
			{
				'genesis-custom-blocks/example-post': {
					title: 'An Example Post',
					category: 'widget',
					keywords: [ 'foobaz', 'example' ],
				},
				'genesis-custom-blocks/example-email': {
					title: 'Example Email',
					category: 'widget',
					keywords: [ 'example-keyword', 'another' ],
				},
			},
			Edit
		);

		expect( mockRegisterBlockType ).toHaveBeenNthCalledWith(
			2,
			expect.any( String ),
			expect.objectContaining( expectedArgs )
		);
	} );
} );
