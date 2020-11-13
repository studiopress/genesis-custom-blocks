/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { PostTitle } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { FieldsGrid } from './';

/**
 * The main editing area component.
 *
 * Todo: add the rest of this and make it dynamic.
 *
 * @return {React.ReactElement} The main editing area.
 */
const Main = () => (
	<div className="flex flex-col flex-grow items-start w-full overflow-scroll">
		<div className="flex flex-col w-full max-w-2xl mx-auto pb-64">
			<div className="block-title-field w-full mt-10 text-center focus:outline-none">
				<PostTitle />
			</div>
			<FieldsGrid />
		</div>
	</div>
);

export default Main;
