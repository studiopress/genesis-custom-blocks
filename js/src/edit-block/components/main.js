/* global gcbEditor */

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BottomNotice, PostTitle, TopNotice } from './';
import { useBlock, useTemplate } from '../hooks';

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
	const { isOnboardingPost: initialIsOnboarding, template: initialTemplate } = gcbEditor;
	const [ template, setTemplate ] = useState( initialTemplate );
	const { fetchTemplate } = useTemplate( setTemplate );
	const { block } = useBlock();
	const isPublished = useSelect( ( select ) => select( 'core/editor' ).isCurrentPostPublished() );
	const isOnboarding = initialIsOnboarding && ! isPublished;

	useEffect( () => {
		if ( Boolean( block.name ) ) {
			fetchTemplate( block.name );
		}
	}, [ block.name, fetchTemplate ] );

	return (
		<div className="flex flex-col flex-grow items-start w-full overflow-scroll">
			<div className="flex flex-col w-full max-w-2xl mx-auto pl-8 pr-8 pb-64">
				<div className="text-4xl w-full mt-10 text-center focus:outline-none">
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
