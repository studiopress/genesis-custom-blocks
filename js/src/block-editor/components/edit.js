/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
// @ts-ignore Declaration file is outdated.
import { store as blockEditorStore, useBlockProps } from '@wordpress/block-editor';
import { Modal, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { ENTER } from '@wordpress/keycodes';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import { EditorForm, GcbInspector } from './';
import { MEDIA_LIBRARY_BUTTON_CLASS } from '../constants';
import { getFieldsAsArray } from '../../common/helpers';
import { EDITOR_LOCATION } from '../../common/constants';

/**
 * The editor component for the block.
 *
 * @param {Object} props The props of this component.
 * @param {import('../../edit-block/hooks/useBlock').Block} props.block The block.
 * @param {Object} props.blockProps The block's props.
 * @return {React.ReactElement} The editor display.
 */
const Edit = ( { block, blockProps } ) => {
	const [ isModalDisplaying, setIsModalDisplaying ] = useState( false );
	const hasEditorField = getFieldsAsArray( block.fields ).some(
		( field ) => ! field.location || EDITOR_LOCATION === field.location
	);

	const innerBlockFields = getFieldsAsArray( block.fields ).filter(
		( field ) => 'inner_blocks' === field.control
	);

	const hasInnerBlocksField = Boolean( innerBlockFields.length );
	const innerBlocksFieldLabel = hasInnerBlocksField
		? innerBlockFields[ 0 ].label
		: '';

	/**
	 * Gets whether the passed block has a selected InnerBlock.
	 *
	 * @param {Object} blockCandidate The block to examine for InnerBlocks.
	 * @param {Object} selectedBlock The block that's selected in the editor.
	 * @return {boolean} Whether the passed block has a selected InnerBlock.
	 */
	const hasSelectedInnerBlock = ( blockCandidate, selectedBlock ) =>
		blockCandidate?.innerBlocks?.length &&
			blockCandidate.innerBlocks.some( ( innerBlock ) =>
				( Boolean( selectedBlock?.clientId ) &&
					innerBlock?.clientId === selectedBlock?.clientId
				) ||
				hasSelectedInnerBlock( innerBlock, selectedBlock )
			);

	/** @type {boolean} Whether this block has an inner block that's selected. */
	const isInnerBlockSelected = useSelect(
		( select ) => {
			const store = select( blockEditorStore.name );

			// @ts-ignore Type definition is outdated.
			return hasSelectedInnerBlock( store.getBlock( blockProps.clientId ), store.getSelectedBlock() );
		},
		[ blockProps.clientId, blockProps.isSelected ]
	);

	return (
		<>
			<GcbInspector blockProps={ blockProps } block={ block } />
			<div { ...useBlockProps() } className={ blockProps.className } key={ `form-controls-${ block.name }` }>
				{ ( blockProps.isSelected || isInnerBlockSelected ) && hasEditorField && ! block.displayModal
					? <EditorForm block={ block } blockProps={ blockProps } />
					: (
						<>
							{ hasInnerBlocksField
								? (
									<Notice status="info" isDismissible={ false }>
										{ sprintf(
											/* translators: %1$s: the field name */
											__( 'The field %1$s will not display in this preview, but will display on the front-end', 'genesis-custom-blocks' ),
											innerBlocksFieldLabel
										) }
									</Notice>
								) : null
							}
							<div
								role="button"
								tabIndex={ 0 }
								aria-label={ __( 'Edit the block', 'genesis-custom-blocks' ) }
								onClick={ ( event ) => {
									event.stopPropagation();
									setIsModalDisplaying( true );
								} }
								onKeyDown={ ( event ) => {
									if ( ENTER === event.keyCode ) {
										event.stopPropagation();
										setIsModalDisplaying( true );
									}
								} }
							>
								{ isModalDisplaying
									? (
										<Modal
											title={ block.title }
											// @ts-ignore The declaration file is outdated.
											onRequestClose={ ( event ) => {
												event.stopPropagation();

												// Mainly from https://github.com/WordPress/gutenberg/issues/12830#issuecomment-607644893
												// If the close request is coming from clicking the 'Media Library' button,
												// Don't close this modal.
												if ( ! event.target.classList.contains( MEDIA_LIBRARY_BUTTON_CLASS ) ) {
													setIsModalDisplaying( false );
												}
											} }
										>
											<EditorForm
												block={ block }
												blockProps={ blockProps }
											/>
										</Modal>
									) : null
								}
								<ServerSideRender
									block={ `genesis-custom-blocks/${ block.name }` }
									attributes={ blockProps.attributes }
									className="genesis-custom-blocks-editor__ssr"
									httpMethod="POST"
								/>
							</div>
						</>
					)
				}
			</div>
		</>
	);
};

export default Edit;
