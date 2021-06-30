/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { store as blockEditorStore } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import { Fields, GcbInspector } from './';
import { getFieldsAsArray, getIconComponent } from '../../common/helpers';
import { EDITOR_LOCATION } from '../../common/constants';

/**
 * The editor component for the block.
 *
 * @param {Object} props The props of this component.
 * @param {Object} props.blockProps The block's props.
 * @param {Object} props.block The block.
 * @return {React.ReactElement} The editor display.
 */
const Edit = ( { blockProps, block } ) => {
	const { attributes, className, clientId, isSelected } = blockProps;
	const hasEditorField = getFieldsAsArray( block.fields ).some( ( field ) => {
		return ! field.location || EDITOR_LOCATION === field.location;
	} );

	/** @type {boolean} Whether this block has an inner block that's selected. */
	const isInnerBlockSelected = useSelect(
		( select ) => {
			const store = select( blockEditorStore );
			// @ts-ignore Type definition is outdated.
			const ownBlock = store.getBlock( clientId );
			// @ts-ignore Type definition is outdated.
			const selectedBlock = store.getSelectedBlock();

			return ownBlock?.innerBlocks?.length &&
				ownBlock.innerBlocks.some( ( innerBlock ) =>
					innerBlock.clientId === selectedBlock.clientId
				);
		},
		[ clientId, isSelected ]
	);

	return (
		<>
			<GcbInspector blockProps={ blockProps } block={ block } />
			<div className={ className } key={ `form-controls-${ block.name }` }>
				{ ( isSelected || isInnerBlockSelected ) && hasEditorField ? (
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
				) : (
					<ServerSideRender
						block={ `genesis-custom-blocks/${ block.name }` }
						attributes={ attributes }
						className="genesis-custom-blocks-editor__ssr"
						httpMethod="POST"
					/>
				) }
			</div>
		</>
	);
};

export default Edit;
