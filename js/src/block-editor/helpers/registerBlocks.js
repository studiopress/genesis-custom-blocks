/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getGcbBlockAttributes } from './';
import { getIconComponent } from '../../common/helpers';

/**
 * Loops through all of the blocks, but not guaranteed to be sequential.
 *
 * @param {Object} genesisCustomBlocks Genesis Custom Blocks properties, available via wp_localize_script().
 * @param {Object} gcbBlocks The registered Genesis Custom Blocks blocks, available via wp_add_inline_script().
 * @param {React.FunctionComponent} EditComponent The edit component to render the blocks.
 */
const registerBlocks = ( genesisCustomBlocks, gcbBlocks, EditComponent ) => {
	for ( const blockName in gcbBlocks ) {
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

		registerBlockType( blockName, {
			title: block.title,
			category: 'object' === typeof block.category ? block.category.slug : block.category,
			icon: getIconComponent( block.icon ),
			keywords: block.keywords,
			attributes: getGcbBlockAttributes( block.fields ),
			edit( props ) {
				return <EditComponent blockProps={ props } block={ block } />;
			},
			save() {
				return <InnerBlocks.Content />;
			},
		} );
	}
};

export default registerBlocks;
