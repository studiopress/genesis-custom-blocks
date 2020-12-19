/* global gcbEditor */

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { BottomNotice, PostTitle, TopNotice } from './';
import { useBlock } from '../hooks';

/**
 * @typedef {Object} MainProps The component props.
 * @property {React.ReactElement[]} children THe component children.
 */

/**
 * The main editing area component.
 *
 * @param {MainProps} props
 * @return {React.ReactElement} The main editing area.
 */
const Main = ( { children } ) => {
	// @ts-ignore
	const { template: initialTemplate, isOnboardingPost: initialIsOnboarding } = gcbEditor;
	const [ template, setTemplate ] = useState( initialTemplate );
	const { block } = useBlock();
	const { createErrorNotice } = useDispatch( 'core/notices' );
	const isSavingPost = useSelect( ( select ) => select( 'core/editor' ).isSavingPost() );
	const isPublished = useSelect( ( select ) => select( 'core/editor' ).isCurrentPostPublished() );
	const isOnboarding = initialIsOnboarding && ! isPublished;

	useEffect( () => {
		if ( isSavingPost && Boolean( block.name ) ) {
			apiFetch( {
				path: addQueryArgs(
					'/genesis-custom-blocks/template-file',
					{ blockName: block.name }
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
		}
	}, [ block.name, createErrorNotice, isSavingPost ] );

	return (
		<div className="flex flex-col flex-grow items-start w-full overflow-scroll">
			<div className="flex flex-col w-full max-w-2xl mx-auto pb-64">
				<div className="block-title-field w-full mt-10 text-center focus:outline-none">
					<PostTitle />
				</div>
				<TopNotice isOnboarding={ isOnboarding } template={ template } />
				{ children }
				{ isOnboarding ? <BottomNotice /> : null }
			</div>
		</div>
	);
};

export default Main;
