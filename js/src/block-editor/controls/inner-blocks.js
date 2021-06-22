/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components';

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

const GcbInnerBlocksControl = ( { field } ) => (
	<BaseControl label={ field.label } help={ field.help } id={ `gcb-inner-blocks-${ field.name }` }>
		<InnerBlocks />
	</BaseControl>
);

export default GcbInnerBlocksControl;
