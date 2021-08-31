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
 * The category editor section.
 *
 * @return {React.ReactElement} The section to edit the block category.
 */
const ModalDisplaySection = () => {
	const { block: { displayModal = false }, changeBlock } = useBlock();

	/**
	 * Handles changing whether a post type is enabled.
	 *
	 * @param {React.ChangeEvent} event The event on changing the post type.
	 */
	const handleChange = ( event ) => {
		if ( ! event.target ) {
			return;
		}

		// @ts-ignore
		changeBlock( { displayModal: Boolean( event.target.checked ) } );
	};

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
						handleChange( event );
					} }
				/>
				<label className="text-sm" htmlFor={ id }>
					{ __( 'Display In Modal', 'genesis-custom-blocks' ) }
				</label>
			</div>
		</div>
	);
};

export default ModalDisplaySection;
