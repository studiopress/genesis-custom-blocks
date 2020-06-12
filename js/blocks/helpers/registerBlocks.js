/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import icons from '../../../assets/icons.json';
import { getGcbBlockAttributes } from './';

/**
 * Loops through all of the blocks, but not guaranteed to be sequential.
 *
 * @param {Object} genesisCustomBlocks Genesis Custom Blocks properties, available via wp_localize_script().
 * @param {Object} gcbBlocks The registered Genesis Custom Blocks blocks, available via wp_add_inline_script().
 * @param {Function} EditComponent The edit component to render the blocks.
 */
const registerBlocks = ( genesisCustomBlocks, gcbBlocks, EditComponent ) => {
	for ( const blockName in gcbBlocks ) {
		// Avoid weird inheritance issues. Which should not happen because the backend is safe.
		if ( ! gcbBlocks.hasOwnProperty( blockName ) ) {
			continue;
		}

		// Get the block definition.
		const block = gcbBlocks[ blockName ];
		block.block_slug = blockName;

		// Don't register the block if it's excluded for this post type.
		if ( genesisCustomBlocks.hasOwnProperty( 'postType' ) && block.hasOwnProperty( 'excluded' ) ) {
			if ( -1 !== block.excluded.indexOf( genesisCustomBlocks.postType ) ) {
				continue;
			}
		}

		let icon = '';
		if ( 'undefined' !== typeof icons[ block.icon ] ) {
			icon = (
				<span dangerouslySetInnerHTML={ { __html: icons[ block.icon ] } } />
			);
		}

		// Register the block.
		registerBlockType( blockName, {
			title: block.title,
			category: 'object' === typeof block.category ? block.category.slug : block.category,
			icon,
			keywords: block.keywords,
			attributes: getGcbBlockAttributes( block.fields ),
			edit( props ) {
				return <EditComponent blockProps={ props } block={ block } />;
			},
			save() {
				return null;
			},
		} );
	}
};

export default registerBlocks;
