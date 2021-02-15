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
import { useSelect } from '@wordpress/data';
import { mediaUpload } from '@wordpress/editor';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

const allowedTypes = [ 'image' ];
const defaultImgId = 0;

const Image = ( props ) => {
	const { field, getValue, instanceId, onChange } = props;
	const fieldValue = getValue( props );

	const [ isUploading, setIsUploading ] = useState( false );
	const [ imageSrc, setImageSrc ] = useState( '' );
	const [ imageAlt, setImageAlt ] = useState( '' );

	// @ts-ignore: type definition file is missing getMedia().
	const { getMedia } = useSelect( ( select ) => {
		return select( 'core' );
	} );

	useEffect( () => {
		const newImage = getMedia( fieldValue );

		if ( newImage?.source_url ) { // eslint-disable-line camelcase
			setImageSrc( newImage.source_url );
		} else if ( 'string' === typeof newImage ) {
			// Backwards-compatibility: the fieldValue used to be the URL, not the ID.
			setImageSrc( newImage );
		}

		if ( newImage?.alt ) {
			setImageAlt( newImage.alt );
		} else if ( newImage?.source_url ) { // eslint-disable-line camelcase
			setImageAlt(
				/* translators: %1$s: the image src */
				sprintf( __( 'This image has no alt attribute, but its src is %1$s', 'genesis-custom-blocks' ), newImage.source_url )
			);
		} else {
			setImageAlt( __( 'This image has no alt attribute', 'genesis-custom-blocks' ) );
		}
	}, [ fieldValue, getMedia ] );

	/** @param {Object} image The image to update. */
	const updateImageSrc = ( image ) => {
		if ( image?.id ) {
			onChange( parseInt( image.id ) );
			setImageSrc( image?.url );
		}
	};

	/** @param {Object} image The image that was selected. */
	const onSelect = ( image ) => {
		if ( ! image.hasOwnProperty( 'url' ) || ! image.hasOwnProperty( 'id' ) ) {
			return;
		}
		if ( 'blob' === image.url.substr( 0, 4 ) ) {
			// Still uploading…
			return;
		}

		updateImageSrc( image );
		setIsUploading( false );
	};

	const removeImage = () => {
		onChange( defaultImgId );
	};

	const uploadFiles = ( files ) => {
		mediaUpload( {
			allowedTypes,
			filesList: files,
			onFileChange: ( image ) => {
				onSelect( image[ 0 ] );
			},
			maxUploadFileSize: 0,
			onError: () => {},
		} );
	};

	return (
		<BaseControl className="genesis-custom-blocks-media-controls" label={ field.label } id={ `gcb-image-${ instanceId }` }>
			{ !! field.help
				? <p className="components-base-control__help">{ field.help }</p>
				: null
			}
			{ imageSrc
				? (
					<>
						<img className="gcb-image__img" src={ imageSrc } alt={ imageAlt } />
						<Button
							disabled={ !! isUploading }
							className="gcb-image__remove"
							onClick={ removeImage }
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

export default Image;
