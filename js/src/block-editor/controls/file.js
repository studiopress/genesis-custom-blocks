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
	FormFileUpload,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { MEDIA_LIBRARY_BUTTON_CLASS } from '../constants';
import { useMedia } from '../hooks';

const defaultFileId = 0;

const GcbFileControl = ( props ) => {
	const { field, getValue, onChange, parentBlockProps } = props;
	const fieldValue = getValue( props );
	const {
		mediaSrc,
		isUploading,
		onSelect,
		removeMedia,
		setIsUploading,
		uploadFiles,
	} = useMedia( fieldValue, onChange );
	const fileRegex = /[^\/]+\.[^\/]+$/;
	const id = `gcb-file-${ parentBlockProps?.clientId }`;

	return (
		<BaseControl className="genesis-custom-blocks-media-controls" label={ field.label } id={ id }>
			{ !! field.help
				? <p className="components-base-control__help">{ field.help }</p>
				: null
			}
			{ !! mediaSrc
				? (
					<>
						{ mediaSrc.match( fileRegex )
							? <pre>{ mediaSrc.match( fileRegex )[ 0 ] }</pre>
							: null
						}
						<Button
							id={ id }
							disabled={ !! isUploading }
							className="gcb-image__remove"
							onClick={ () => {
								onChange( defaultFileId );
								removeMedia();
							} }
						>
							{ __( 'Remove', 'genesis-custom-blocks' ) }
						</Button>
					</>
				) : (
					<Placeholder
						className="gcb-image__placeholder"
						icon="media-default"
						label={ __( 'File', 'genesis-custom-blocks' ) }
						instructions={ __( 'Drag a file, upload a new one or select a file from your library.', 'genesis-custom-blocks' ) }
					>
						<DropZone
							onFilesDrop={ ( files ) => {
								if ( files.length ) {
									setIsUploading( true );
									uploadFiles( files );
								}
							} }
						/>
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
										accept="*"
										multiple={ false }
									>
										{ __( 'Upload', 'genesis-custom-blocks' ) }
									</FormFileUpload>
									<MediaUploadCheck>
										<MediaUpload
											gallery={ false }
											multiple={ false }
											onSelect={ onSelect }
											value={ getValue( props ) }
											render={ ( { open } ) => (
												<div className="components-media-library-button">
													<Button
														id={ id }
														disabled={ !! isUploading }
														className={ MEDIA_LIBRARY_BUTTON_CLASS }
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

export default GcbFileControl;
