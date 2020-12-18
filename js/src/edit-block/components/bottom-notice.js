/* global gcbEditor */

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const BottomNotice = () => {
	// @ts-ignore
	const { isOnboardingPost } = gcbEditor;

	if ( ! isOnboardingPost ) {
		return null;
	}

	const textClasses = 'text-sm mt-2 ml-2';
	const fieldTypesUrl = 'https://developer.wpengine.com/genesis-custom-blocks/fields/';

	return (
		<div className="mt-4 p-5 bg-blue-100 text-blue-700 border-l-4 border-blue-700 rounded-sm">
			<h2 className="text-lg font-semibold text-blue-900 ml-2">
				<span role="img" aria-label={ __( 'Eyeglass emoji', 'genesis-custom-blocks' ) }>🧐</span>
				&nbsp;
				{ __( 'Try adding a field.', 'genesis-custom-blocks' ) }
			</h2>
			<p className={ textClasses }>
				{ __( 'Fields let you define the options you see when adding your block to a post or page.', 'genesis-custom-blocks' ) }
			</p>
			<p className={ textClasses }>
				{ __( 'There are lots of different field types that let you build powerfully dynamic custom blocks.', 'genesis-custom-blocks' ) }
			</p>
			<p className="text-xs font-semibold ml-2 mt-2">
				{ __( 'Learn more:', 'genesis-custom-blocks' ) }
				&nbsp;
				<a className="underline" href={ fieldTypesUrl } target="_blank" rel="noreferrer noopener">
					{ __( 'Field Types', 'genesis-custom-blocks' ) }
				</a>
			</p>
		</div>
	);
};

export default BottomNotice;
