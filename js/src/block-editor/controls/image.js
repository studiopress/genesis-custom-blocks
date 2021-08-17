/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import {
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
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

const allowedTypes = [ 'image' ];
const defaultImgId = 0;

const GcbImageControl = ( props ) => {
	const { field, getValue, clientId, onChange } = props;
	const fieldValue = getValue( props );
	const {
		mediaAlt,
		mediaSrc,
		isUploading,
		onSelect,
		removeMedia: removeImage,
		setIsUploading,
		uploadFiles,
	} = useMedia( fieldValue, onChange, allowedTypes );
	const id = `gcb-image-${ clientId }`;

	return (
		<BaseControl className="genesis-custom-blocks-media-controls" label={ field.label } id={ id }>
			{ !! field.help
				? <p className="components-base-control__help">{ field.help }</p>
				: null
			}
			{ !! mediaSrc
				? (
					<>
						<img className="gcb-image__img" src={ mediaSrc } alt={ mediaAlt } />
						<Button
							id={ id }
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
					<Placeholder
						className="gcb-image__placeholder"
						icon="format-image"
						instructions={ __( 'Drag an image, upload a new one or select a file from your library.', 'genesis-custom-blocks' ) }
					>
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
									<MediaUploadCheck>
										<MediaUpload
											gallery={ false }
											multiple={ false }
											onSelect={ onSelect }
											allowedTypes={ allowedTypes }
											value={ getValue( props ) }
											render={ ( { open } ) => (
												<div className="components-media-library-button">
													<Button
														id={ id }
														disabled={ !! isUploading }
														className="editor-media-placeholder__button"
														onClick={ open }
													>
														{ __( 'Media Library', 'genesis-custom-blocks' ) }
													</Button>
												</div>
											) }
										/>
									</MediaUploadCheck>
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
