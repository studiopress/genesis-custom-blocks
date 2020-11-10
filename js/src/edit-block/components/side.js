/**
 * External dependencies
 */
import * as React from 'react';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockPanel, FieldPanel } from './';

/**
 * The side component.
 *
 * @return {React.ReactElement} The side component.
 */
const Side = () => {
	const [ displayFieldPanel, setDisplayFieldPanel ] = useState( false );
	const toggleDisplayFieldPanel = () => {
		setDisplayFieldPanel( ( shouldDisplayFieldPanel ) => ! shouldDisplayFieldPanel );
	};
	const buttonClass = 'flex items-center h-12 px-5 text-sm focus:outline-none';

	return (
		<div className="side flex-shrink-0 flex flex-col border-l border-gray-300 overflow-scroll">
			<div className="flex w-full border-b border-gray-300">
				<button
					onClick={ toggleDisplayFieldPanel }
					className={
						classNames(
							buttonClass,
							{ 'font-semibold border-b-4 border-blue-600': ! displayFieldPanel }
						)
					}
				>
					{ __( 'Block', 'genesis-custom-blocks' ) }
				</button>
				<button
					onClick={ toggleDisplayFieldPanel }
					className={
						classNames(
							buttonClass,
							{ 'font-semibold border-b-4 border-blue-600': displayFieldPanel }
						)
					}
				>
					{ __( 'Field', 'genesis-custom-blocks' ) }
				</button>
			</div>
			{ displayFieldPanel ? <FieldPanel /> : <BlockPanel /> }
		</div>
	);
};

export default Side;
