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
import { useImage } from '../hooks';

const allowedTypes = [ 'image' ];
const defaultImgId = 0;

const GcbImageControl = ( props ) => {
	const { field, getValue, instanceId, onChange } = props;
	const fieldValue = getValue( props );
	const {
		imageAlt,
		imageSrc,
		isUploading,
		onSelect,
		removeImage,
		setIsUploading,
		uploadFiles,
	} = useImage( fieldValue, onChange, allowedTypes );

	return (
		<BaseControl className="genesis-custom-blocks-media-controls" label={ field.label } id={ `gcb-image-${ instanceId }` }>
			{ !! field.help
				? <p className="components-base-control__help">{ field.help }</p>
				: null
			}
			{ !! imageSrc
				? (
					<>
						<img className="gcb-image__img" src={ imageSrc } alt={ imageAlt } />
						<Button
							disabled={ !! isUploading }
							className="gcb-image__remove"
							onClick={ () => {
								onChange( defaultImgId );
								removeImage();
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
										accept="image/*"
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

export default GcbImageControl;
