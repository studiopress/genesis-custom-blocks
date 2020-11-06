/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FieldPanel } from './';

/**
 * The side component.
 *
 * @return {React.ReactElement} The side component.
 */
const Side = () => {
	return (
		<div className="side flex-shrink-0 flex flex-col border-l border-gray-300 overflow-scroll">
			<div className="flex w-full border-b border-gray-300">
				<button className="flex items-center h-12 px-5 text-sm focus:outline-none">
					{ __( 'Block', 'genesis-custom-blocks' ) }
				</button>
				<button className="flex items-center h-12 px-5 text-sm font-semibold border-b-4 border-blue-600 focus:outline-none">
					{ __( 'Field', 'genesis-custom-blocks' ) }
				</button>
			</div>
			<FieldPanel />
		</div>
	);
};

export default Side;
