/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { EDIT_BLOCK_CONTEXT } from '../../common/constants';

const GcbInnerBlocksControl = ( { field, context } ) => (
	<BaseControl label={ field.label } help={ field.help } id={ `gcb-inner-blocks-${ field.name }` }>
		{
			EDIT_BLOCK_CONTEXT === context
				? __( 'This field only works in the block editor.', 'genesis-custom-blocks' )
				: <InnerBlocks />
		}
	</BaseControl>
);

export default GcbInnerBlocksControl;
