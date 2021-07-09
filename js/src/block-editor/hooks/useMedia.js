/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { mediaUpload } from '@wordpress/editor';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * @callback OnSelect Handler for selecting.
 * @param {Object} image The image that was selected.
 * @return {void}
 */

/**
 * @callback RemoveImage Removes the image src.
 * @return {void}
 */

/**
 * @callback SetIsUploading Sets whether the image is uploading.
 * @param {boolean} isUploading The new state for whether this is uploading.
 */

/**
 * @callback UploadFiles Uploads the files.
 * @param {ArrayLike<File>} files The files to upload.
 */

/**
 * @typedef {Object} UseMediaReturn The return value of the hook.
 * @property {string} mediaAlt The alt attribute of the <img>.
 * @property {string} mediaSrc The src attribute of the media.
 * @property {boolean} isUploading Whether the media is uploading.
 * @property {OnSelect} onSelect Handler for selecting.
 * @property {RemoveImage} removeMedia Removes the media src.
 * @property {SetIsUploading} setIsUploading Sets whether the image is uploading.
 * @property {UploadFiles} uploadFiles Uploads the files.
 */

/**
 * Gets the image context and functions to change it.
 *
 * @param {number|string} fieldValue The current field value.
 * @param {(imageId: number) => void} onChange Handles changing the field value.
 * @param {string[]} [allowedTypes] The allowed media types.
 * @return {UseMediaReturn} The return value of this hook.
 */
const useMedia = ( fieldValue, onChange, allowedTypes ) => {
	const defaultImageSrc = '';
	const [ mediaSrc, setMediaSrc ] = useState( defaultImageSrc );
	const [ isUploading, setIsUploading ] = useState( false );
	const [ mediaAlt, setImageAlt ] = useState( '' );

	// @ts-ignore: type definition file does not have getMedia().
	const newImage = useSelect( ( select ) => {
		// @ts-ignore The function isn't in the declaration file.
		return select( 'core' ).getMedia( fieldValue );
	} );

	useEffect( () => {
		if ( newImage?.source_url ) { // eslint-disable-line camelcase
			setMediaSrc( newImage.source_url );
		} else if ( 'string' === typeof newImage ) {
			// Backwards-compatibility: the fieldValue used to be the URL, not the ID.
			setMediaSrc( newImage );
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
	}, [ newImage ] );

	/** @param {Object} image The image to update. */
	const updateImageSrc = ( image ) => {
		if ( image?.id ) {
			onChange( parseInt( image.id ) );
			setMediaSrc( image?.url );
		}
	};

	/** @type {OnSelect} */
	const onSelect = ( image ) => {
		if ( ! image.hasOwnProperty( 'url' ) || ! image.hasOwnProperty( 'id' ) ) {
			return;
		}
		if ( 'blob' === image.url.substr( 0, 4 ) ) {
			return; // Still uploading…
		}

		updateImageSrc( image );
		setIsUploading( false );
	};

	/** @type {RemoveImage} */
	const removeImage = () => {
		setMediaSrc( defaultImageSrc );
	};

	/** @type {UploadFiles} */
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

	return {
		mediaAlt,
		mediaSrc,
		isUploading,
		onSelect,
		removeMedia: removeImage,
		setIsUploading,
		uploadFiles,
	};
};

export default useMedia;
