/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Placeholder,
	DropZone,
	DropZoneProvider,
	FormFileUpload,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useMedia } from '../hooks';

const allowedTypes = [ 'application' ];
const defaultImgId = 0;

const GcbFileControl = ( props ) => {
	const { field, getValue, instanceId, onChange } = props;
	const fieldValue = getValue( props );
	const {
		mediaSrc,
		isUploading,
		onSelect,
		removeMedia,
		setIsUploading,
		uploadFiles,
	} = useMedia( fieldValue, onChange, allowedTypes );
	const fileRegex = /[^\/]+\.[^\/]+$/;

	return (
		<BaseControl className="genesis-custom-blocks-media-controls" label={ field.label } id={ `gcb-file-${ instanceId }` }>
			{ !! field.help
				? <p className="components-base-control__help">{ field.help }</p>
				: null
			}
			{ !! mediaSrc
				? (
					<>
						{ mediaSrc.match( fileRegex )
							? mediaSrc.match( fileRegex )[ 0 ]
							: null
						}
						<Button
							disabled={ !! isUploading }
							className="gcb-image__remove"
							onClick={ () => {
								onChange( defaultImgId );
								removeMedia();
							} }
						>
							{ __( 'Remove', 'genesis-custom-blocks' ) }
						</Button>
					</>
				) : (
					<Placeholder className="gcb-image__placeholder" icon="format-image" label={ __( 'Image', 'genesis-custom-blocks' ) } instructions={ __( 'Drag an image, upload a new one or select a file from your library.', 'genesis-custom-blocks' ) }>
						<DropZoneProvider>
							<DropZone
								onFilesDrop={ ( files ) => {
									if ( files.length ) {
										setIsUploading( true );
										uploadFiles( files );
									}
								} }
							/>
						</DropZoneProvider>
						{ isUploading
							? <Spinner />
							: (
								<>
									<FormFileUpload
										disabled={ !! isUploading }
										onChange={ ( event ) => {
											setIsUploading( true );
											uploadFiles( event.target.files );
										} }
										accept="application/*"
										multiple={ false }
									>
										{ __( 'Upload', 'genesis-custom-blocks' ) }
									</FormFileUpload>
									<MediaUpload
										gallery={ false }
										multiple={ false }
										onSelect={ onSelect }
										allowedTypes={ allowedTypes }
										value={ getValue( props ) }
										render={ ( { open } ) => (
											<div className="components-media-library-button">
												<Button
													disabled={ !! isUploading }
													className="editor-media-placeholder__button"
													onClick={ open }
												>
													{ __( 'Media Library', 'genesis-custom-blocks' ) }
												</Button>
											</div>
										) }
									/>
								</>
							)
						}
					</Placeholder>
				)
			}
		</BaseControl>
	);
};

export default GcbFileControl;