/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useBlock, useField } from '../hooks';
import { Fields } from '../../block-editor/components';

/**
 * The editor preview.
 *
 * @return {React.ReactElement} The editor preview.
 */
const EditorPreview = () => {
	const { block, changeBlock } = useBlock();
	const { getFields } = useField();
	const { previewAttributes = {} } = block;
	const fields = getFields();

	/** @param {Object} newAttributes Attribute (field) names and values. */
	const setAttributes = ( newAttributes ) => {
		changeBlock( {
			previewAttributes: {
				...previewAttributes,
				...newAttributes,
			},
		} );
	};

	return (
		<div className="block-form">
			{
				Boolean( Object.keys( fields ).length )
					? (
						<Fields
							key="example-fields"
							fields={ fields }
							parentBlockProps={ {
								setAttributes,
								attributes: previewAttributes,
							} }
							parentBlock={ {} }
						/>
					) : (
						<p>
							{ __( 'Please add a field to preview the block.', 'genesis-custom-blocks' ) }
						</p>
					)
			}
		</div>
	);
};

export default EditorPreview;
