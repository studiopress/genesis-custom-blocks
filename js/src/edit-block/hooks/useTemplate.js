/**
 * External dependencies
 */
import debounceFn from 'debounce-fn';

/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * @typedef {Object} Template A template as returned from the request.
 * @property {string} templatePath The path to the template.
 * @property {boolean} templateExists Whether there is a template at that path.
 */

/**
 * @typedef {Object} UseTemplateReturn The return value of useBlock.
 * @property {function(string):void} fetchTemplate Fetches and updates the template.
 */

/**
 * Gets the post types context.
 *
 * @param {function(Template):void} setTemplate Sets the template if it's fetched.
 * @return {UseTemplateReturn} The post types.
 */
const useTemplate = ( setTemplate ) => {
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
					 * @param {Object} response The response from the REST request.
					 * @param {string} response.templatePath The path of the template, if any.
					 * @param {boolean} response.templateExists Whether the template exists.
					 */
					( response ) => {
						if ( response && response.hasOwnProperty( 'templatePath' ) ) {
							setTemplate( {
								templatePath: response.templatePath,
								templateExists: response.templateExists,
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
							)
						);
					}
				);
			},
			{ wait: 300 }
		),
		[ createErrorNotice, setTemplate ]
	);

	return { fetchTemplate };
};

export default useTemplate;
