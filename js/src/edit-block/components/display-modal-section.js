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
 * The display modal section.
 *
 * @return {React.ReactElement} The section to edit the block category.
 */
const DisplayModalSection = () => {
	const { block: { displayModal = false }, changeBlock } = useBlock();
	const id = 'display-in-modal';

	return (
		<div className="mt-5">
			<div className="mt-2">
				<input
					type="checkbox"
					id={ id }
					className="mr-2"
					value="1"
					checked={ displayModal }
					onChange={ ( event ) => {
						if ( event.target ) {
							// @ts-ignore
							changeBlock( { displayModal: Boolean( event.target.checked ) } );
						}
					} }
				/>
				<label className="text-sm" htmlFor={ id }>
					{ __( 'Open block fields in a modal instead of rendering in place', 'genesis-custom-blocks' ) }
				</label>
			</div>
		</div>
	);
};

export default DisplayModalSection;
