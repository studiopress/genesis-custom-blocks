/* global gcbEditor */

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { BottomNotice, PostTitle, TopNotice } from './';

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
	const { isOnboardingPost: initialIsOnboarding } = gcbEditor;
	const isPublished = useSelect( ( select ) => select( 'core/editor' ).isCurrentPostPublished() );
	const isOnboarding = initialIsOnboarding && ! isPublished;

	return (
		<div className="flex flex-col flex-grow items-start w-full overflow-scroll">
			<div className="flex flex-col w-full max-w-2xl mx-auto pl-8 pr-8 pb-64">
				<div className="text-4xl w-full mt-10 text-center">
					<PostTitle />
				</div>
				<TopNotice isOnboarding={ isOnboarding } />
				{ children }
				{ isOnboarding ? <BottomNotice /> : null }
			</div>
		</div>
	);
};

export default Main;
