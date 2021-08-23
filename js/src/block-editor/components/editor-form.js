/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Fields } from './';
import { getFieldsAsArray, getIconComponent } from '../../common/helpers';

/**
 * The editor component for the block.
 *
 * @param {Object} props The props of this component.
 * @param {Object} props.block The block.
 * @param {Object} props.blockProps The block's props.
 *
 * @return {React.ReactElement} The editor display.
 */
const EditorForm = ( { block, blockProps } ) => (
	<div
		className="block-form"
		aria-label={ __( 'GCB block form', 'genesis-custom-blocks' ) }
	>
		<h3>
			<Icon size={ 24 } icon={ getIconComponent( block.icon ) } />
			{ block.title }
		</h3>
		<Fields
			key={ `${ block.name }-fields` }
			fields={ getFieldsAsArray( block.fields ) }
			parentBlockProps={ blockProps }
			parentBlock={ blockProps }
		/>
	</div>
);

export default EditorForm;
