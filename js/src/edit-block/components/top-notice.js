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

/**
 * @typedef {Object} Template The current template.
 * @property {boolean} templateExists Whether the template was found.
 * @property {string} templatePath The path of the template.
 */

/**
 * @typedef {Object} TopNoticeProps The component props.
 * @property {boolean} isOnboarding Whether the onboarding should display now.
 * @property {Template} template The template data.
 */

/**
 * The top notice section.
 *
 * @param {TopNoticeProps} props
 * @return {React.ReactElement} The top notice.
 */
const TopNotice = ( {
	isOnboarding,
	template,
} ) => {
	const urlBlockTemplates = 'https://developer.wpengine.com/genesis-custom-blocks/get-started/add-a-custom-block-to-your-website-content/';
	const urlGetStarted = 'https://developer.wpengine.com/genesis-custom-blocks/get-started/';
	const urlTemplateFunctions = 'https://developer.wpengine.com/genesis-custom-blocks/';
	const isNewPost = useSelect( ( select ) => select( 'core/editor' ).isEditedPostNew() );

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
			{ ! isOnboarding && ! isNewPost && template.templateExists
				? <div className="flex items-center mt-4">
					<span className="text-sm">{ __( 'Template:', 'genesis-custom-blocks' ) }</span>
					<span className="flex items-center w-auto text-xs font-mono ml-1 px-2 py-1 bg-gray-200 rounded-sm">
						<TemplateFile color="gray" templatePath={ template.templatePath } />
					</span>
				</div>
				: null
			}
			{ ! isOnboarding && ! isNewPost && ! template.templateExists
				? <div className="mt-4 p-5 bg-blue-100 text-blue-700 border-l-4 border-blue-700 rounded-sm">
					<div className="flex items-center">
						<QuestionIcon />
						<h4 className="text-lg font-semibold text-blue-900 ml-2">
							{ __( 'Next step: Build your block template.', 'genesis-custom-blocks' ) }
						</h4>
					</div>
					<p className="text-sm mt-2 ml-2">
						{ __( 'To display this block, the plugin will look for this template file in your theme:', 'genesis-custom-blocks' ) }
					</p>
					<p className="flex items-center w-auto text-xs font-mono mt-2 ml-2 px-2 py-1 bg-blue-200 rounded-sm">
						<TemplateFile color="blue" templatePath={ template.templatePath } />
					</p>
					<div className="flex items-center mt-5 text-xs text-blue-800">
						<QuestionIcon />
						<p className="font-semibold ml-1">{ __( 'Learn more:', 'genesis-custom-blocks' ) }</p>
						<a
							className="underline ml-2"
							href={ urlBlockTemplates }
							target="_blank"
							rel="noopener noreferrer"
						>
							{ __( 'Block Templates', 'genesis-custom-blocks' ) }
						</a>
						<a
							className="underline ml-2"
							href={ urlTemplateFunctions }
							target="_blank"
							rel="noopener noreferrer"
						>
							{ __( 'Template Functions', 'genesis-custom-blocks' ) }
						</a>
					</div>
				</div>
				: null
			}
		</>
	);
};

export default TopNotice;
