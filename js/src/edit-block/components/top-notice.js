/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { QuestionIcon, TemplateFile } from './';
import { useTemplate } from '../hooks';

/**
 * @typedef {Object} TopNoticeProps The component props.
 * @property {boolean} isOnboarding Whether the onboarding should display now.
 */

/**
 * The top notice section.
 *
 * @param {TopNoticeProps} props
 * @return {React.ReactElement} The top notice.
 */
const TopNotice = ( { isOnboarding } ) => {
	const urlGetStarted = 'https://developer.wpengine.com/genesis-custom-blocks/get-started/';
	const isNewPost = useSelect( ( select ) => select( 'core/editor' ).isEditedPostNew() );
	const { template } = useTemplate();

	return (
		<>
			{ isOnboarding
				? <div className="mt-4 p-5 bg-blue-100 text-blue-700 border-l-4 border-blue-700 rounded-sm">
					<h2 className="text-lg font-semibold text-blue-900">
						<span role="img" className="mr-2" aria-label={ __( 'Test tube emoji', 'genesis-custom-blocks' ) }>🧪</span>
						{ __( 'Time to experiment!', 'genesis-custom-blocks' ) }
					</h2>
					<ol className="text-sm mt-2 ml-2">
						<li>{ __( 'Choose an icon', 'genesis-custom-blocks' ) }</li>
						<li>{ __( 'Change the category', 'genesis-custom-blocks' ) }</li>
						<li>{ __( 'Investigate a few different field types', 'genesis-custom-blocks' ) }</li>
					</ol>
					<p className="text-sm mt-2 ml-2">
						{ __( "When you're ready, save your block by pressing", 'genesis-custom-blocks' ) }
						&nbsp;
						<strong>
							{ __( 'Publish', 'genesis-custom-blocks' ) }
						</strong>
					</p>
					<div className="flex items-center mt-5 text-xs text-blue-800">
						<QuestionIcon />
						<p className="font-semibold ml-1">{ __( 'Learn more:', 'genesis-custom-blocks' ) }</p>
						&nbsp;
						<a className="underline ml-1" href={ urlGetStarted } target="_blank" rel="noreferrer noopener">
							{ __( 'Get Started', 'genesis-custom-blocks' ) }
						</a>
					</div>
				</div>
				: null
			}
			{ ! isOnboarding && template.templateExists && ! isNewPost
				? <div className="flex items-center mt-4 mb-6">
					<span className="text-sm">{ __( 'Template:', 'genesis-custom-blocks' ) }</span>
					<span className="flex items-center w-auto text-xs font-mono ml-1 px-2 py-1 bg-gray-200 rounded-sm truncate">
						<TemplateFile color="gray" templatePath={ template.templatePath } />
					</span>
				</div>
				: null
			}
		</>
	);
};

export default TopNotice;
