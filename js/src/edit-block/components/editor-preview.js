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
import { PreviewNotice } from './';
import { BUILDER_EDITING_MODE } from '../constants';
import { useBlock, useField } from '../hooks';
import { Fields } from '../../block-editor/components';
import { getFieldsAsArray } from '../../common/helpers';
import { EDIT_BLOCK_CONTEXT } from '../../common/constants';

/**
 * @typedef {Object} EditorPreviewProps The component props.
 * @property {import('./editor').SetEditorMode} setEditorMode Sets the editor mode.
 */

/**
 * The editor preview.
 *
 * @param {EditorPreviewProps} props
 * @return {React.ReactElement} The editor preview.
 */
const EditorPreview = ( { setEditorMode } ) => {
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

	if ( ! getFieldsAsArray( fields ).length ) {
		return (
			<PreviewNotice>
				<button
					className="underline"
					onClick={ () => setEditorMode( BUILDER_EDITING_MODE ) }
				>
					{ __( 'Builder', 'genesis-custom-blocks' ) }
				</button>
			</PreviewNotice>
		);
	}

	return (
		<div className="gcb-editor-form">
			<Fields
				key="example-fields"
				fields={ fields }
				parentBlockProps={ {
					setAttributes,
					attributes: previewAttributes,
				} }
				parentBlock={ {} }
				context={ EDIT_BLOCK_CONTEXT }
			/>
		</div>
	);
};

export default EditorPreview;
