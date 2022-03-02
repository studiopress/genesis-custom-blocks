/**
 * External dependencies
 */
import debounceFn from 'debounce-fn';

/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useEffect, useMemo, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { useBlock } from './';

/**
 * @typedef {Object} Template A template as returned from the request.
 * @property {string}  templatePath   The path to the template.
 * @property {boolean} templateExists Whether there is a template at that path.
 * @property {string}  cssUrl         The URL to the CSS file for the template, if one exists.
 */

/**
 * @typedef {Object} UseTemplateReturn The return value of useBlock.
 * @property {Template} template The template for the block.
 */

/**
 * Gets the template context.
 *
 * @return {UseTemplateReturn} The template context.
 */
const useTemplate = () => {
	// @ts-ignore
	const { template: initialTemplate } = gcbEditor; // eslint-disable-line no-undef
	const [ template, setTemplate ] = useState( initialTemplate );
	const { block } = useBlock();
	const { createErrorNotice } = useDispatch( 'core/notices' );

	const fetchTemplate = useMemo(
		() => debounceFn(
			( newBlockName ) => {
				apiFetch( {
					path: addQueryArgs(
						'/genesis-custom-blocks/template-file',
						{ blockName: newBlockName }
					),
				} ).then(
					/**
					 * Sets the template data, so there can be a notice about it.
					 *
					 * @param {Object}  response                The response from the REST request.
					 * @param {string}  response.templatePath   The path of the template, if any.
					 * @param {boolean} response.templateExists Whether the template exists.
					 * @param {string}  response.cssUrl         The URL of the CSS file, if any.
					 */
					( response ) => {
						if ( response && response.hasOwnProperty( 'templatePath' ) ) {
							setTemplate( {
								templatePath: response.templatePath,
								templateExists: response.templateExists,
								cssUrl: response.cssUrl,
							} );
						}
					}
				).catch(
					/**
					 * Creates an error notice.
					 *
					 * @param {Error} error The error from the request.
					 */
					( error ) => {
						createErrorNotice(
							sprintf(
								/* translators: %1$s: the error message from the request */
								__( 'Failed to get the template file: %1$s', 'genesis-custom-blocks' ),
								error.message
							),
							{ isDismissible: true }
						);
					}
				);
			},
			{ wait: 300 }
		),
		[ createErrorNotice, setTemplate ]
	);

	useEffect( () => {
		if ( Boolean( block.name ) ) {
			fetchTemplate( block.name );
		}
	}, [ block.name, fetchTemplate ] );

	return { template };
};

export default useTemplate;
