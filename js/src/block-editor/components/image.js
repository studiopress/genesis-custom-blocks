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
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

const ALLOWED_TYPES = [ 'image' ];
const DEFAULT_IMG_ID = 0;

const Image = ( props ) => {
	const { field, getValue, instanceId, onChange } = props;
	const fieldValue = getValue( props );
	const [ isUploading, setIsUploading ] = useState( false );

	// @ts-ignore
	const { getMedia } = useSelect( ( select ) => select( 'core' ) );

	useEffect( () => {
		if ( parseInt( fieldValue ) ) {
			const media = getMedia( fieldValue );
			imageSrc.current = media && media.source_url ? media.source_url : '';
		}

		// Backwards-compatibility: this used to save the URL as the fieldValue, not the ID as it does now.
		imageSrc.current = fieldValue;
	}, [ fieldValue, getMedia ] );

	const imageSrc = useRef();

	// This alt logic is taken from the Gutenberg Image block's edit.js file.
	const media = getMedia( fieldValue );
	let imageAlt;
	if ( media && media.alt ) {
		imageAlt = media.alt;
	} else if ( media && media.source_url ) {
		/* translators: %s: the image src */
		imageAlt = sprintf( __( 'This image has no alt attribute, but its src is %s', 'genesis-custom-blocks' ), media.source_url );
	} else {
		imageAlt = __( 'This image has no alt attribute', 'genesis-custom-blocks' );
	}

	const uploadStart = () => setIsUploading( true );

	const uploadComplete = ( image ) => {
		if ( image.hasOwnProperty( 'id' ) ) {
			const newId = parseInt( image.id );
			onChange( newId );
		}

		if ( image.hasOwnProperty( 'url' ) ) {
			imageSrc.current = image.url;
		}

		// Backwards-compatibility: this used to save the URL as the fieldValue, not the ID as it does now.
		setIsUploading( false );
	};

	const onSelect = ( image ) => {
		if ( ! image.hasOwnProperty( 'url' ) || ! image.hasOwnProperty( 'id' ) ) {
			return;
		}
		if ( 'blob' === image.url.substr( 0, 4 ) ) {
			// Still uploading…
			return;
		}

		uploadComplete( image );
	};

	const removeImage = () => {
		// The attribute should be an int, so set it to 0 on removing an image.
		onChange( DEFAULT_IMG_ID );
	};

	const uploadFiles = ( files ) => {
		mediaUpload( {
			allowedTypes: ALLOWED_TYPES,
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
			<img className="gcb-image__img" src={ imageSrc.current } alt={ imageAlt } />
			{ ! imageSrc.current
				? (
					<Placeholder className="gcb-image__placeholder" icon="format-image" label={ __( 'Image', 'genesis-custom-blocks' ) } instructions={ __( 'Drag an image, upload a new one or select a file from your library.', 'genesis-custom-blocks' ) }>
						<DropZoneProvider>
							<DropZone
								onFilesDrop={ ( files ) => {
									if ( files.length ) {
										uploadStart();
										uploadFiles( files );
									}
								} }
							/>
						</DropZoneProvider>
						{ isUploading
							? <Spinner />
							: null
						}
						{ ! isUploading
							? (
								<>
									<FormFileUpload
										disabled={ !! isUploading }
										onChange={ ( event ) => {
											const files = event.target.files;
											uploadStart();
											uploadFiles( files );
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
										allowedTypes={ ALLOWED_TYPES }
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
							: null
						}
					</Placeholder>
				)
				: null
			}
			{ imageSrc.current
				? (
					<Button
						disabled={ !! isUploading }
						className="gcb-image__remove"
						onClick={ removeImage }
					>
						{ __( 'Remove', 'genesis-custom-blocks' ) }
					</Button>
				)
				: null
			}
		</BaseControl>
	);
};

export default Image;
