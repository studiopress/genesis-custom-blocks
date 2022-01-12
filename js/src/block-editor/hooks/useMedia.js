/**
 * WordPress dependencies
 */
// @ts-ignore Declaration is outdated.
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { mediaUpload as legacyMediaUpload } from '@wordpress/editor';
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
 * @typedef {Object} GetImageReturn The return value of the hook.
 * @property {string} source_url The url of the image.
 * @property {string} alt The alt attribute of the image.
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
	const [ media, setMedia ] = useState( {} );
	const [ mediaSrc, setMediaSrc ] = useState( defaultImageSrc );
	const [ isUploading, setIsUploading ] = useState( false );
	const [ mediaAlt, setImageAlt ] = useState( '' );

	const getImage = useSelect( ( select ) => {
		/**
		 * Gets the image.
		 *
		 * @param {number | string} imageId The id of the image.
		 * @return {GetImageReturn | undefined} The image, if any.
		 */
		return ( imageId ) =>
			// @ts-ignore This function is wrong in the declaration file.
			select( 'core' ).getEntityRecord( 'postType', 'attachment', imageId, { context: 'embed' } );
	} );

	/* @type {function|undefined} */
	const mediaUpload = useSelect( ( select ) => {
		// @ts-ignore The function isn't in the declaration file.
		const { getSettings } = select( blockEditorStore );
		return getSettings()?.mediaUpload || legacyMediaUpload;
	} );

	useEffect( () => {
		let timeout;
		if ( ! media?.source_url ) {
			const image = getImage( fieldValue );
			if ( image ) {
				setMedia( image );
			} else {
				timeout = setTimeout(
					() => {
						setMedia( getImage( fieldValue ) );
					},
					1000
				);
			}
		}

		return () => clearTimeout( timeout );
	}, [ media, fieldValue, getImage, setMedia ] );

	useEffect( () => {
		if ( media?.source_url ) {
			setMediaSrc( media.source_url );
		} else if ( 'string' === typeof media ) {
			// Backwards-compatibility: the fieldValue used to be the URL, not the ID.
			setMediaSrc( media );
		}

		if ( media?.alt ) {
			setImageAlt( media.alt );
		} else if ( media?.source_url ) { // eslint-disable-line camelcase
			setImageAlt(
				/* translators: %1$s: the image src */
				sprintf( __( 'This has no alt attribute, but its src is %1$s', 'genesis-custom-blocks' ), media.source_url )
			);
		} else {
			setImageAlt( __( 'This has no alt attribute', 'genesis-custom-blocks' ) );
		}
	}, [ media ] );

	/** @param {Object} ownMedia The media to update. */
	const updateSrc = ( ownMedia ) => {
		if ( ownMedia?.id ) {
			onChange( parseInt( ownMedia.id ) );
			setMediaSrc( ownMedia?.url );
		}
	};

	/** @type {OnSelect} */
	const onSelect = ( ownMedia ) => {
		if ( ! ownMedia.hasOwnProperty( 'url' ) || ! ownMedia.hasOwnProperty( 'id' ) ) {
			return;
		}
		if ( 'blob' === ownMedia.url.substr( 0, 4 ) ) {
			return; // Still uploading…
		}

		updateSrc( ownMedia );
		setIsUploading( false );
	};

	/** @type {RemoveImage} */
	const removeImage = () => setMediaSrc( defaultImageSrc );

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
