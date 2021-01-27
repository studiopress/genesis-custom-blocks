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
import { useBlock } from '../hooks';

/**
 * The slug editing section.
 *
 * @return {React.ReactElement} The slug editing section.
 */
const SlugSection = () => {
	const { block, changeBlock } = useBlock();

	return (
		<div className="mt-5">
			<label className="text-sm" htmlFor="block-name">{ __( 'Slug', 'genesis-custom-blocks' ) }</label>
			<input
				className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				type="text"
				id="block-name"
				value={ block.name }
				onChange={ ( event ) => {
					if ( event.target ) {
						changeBlock( { name: event.target.value } );
					}
				} }
			/>
			<span className="block italic text-xs mt-1">{ __( 'Used to determine the name of the template file.', 'genesis-custom-blocks' ) }</span>
		</div>
	);
};

export default SlugSection;
