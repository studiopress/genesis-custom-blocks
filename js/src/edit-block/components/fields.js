// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * The migration admin page.
 *
 * @return {React.ReactElement} The component for the admin page.
 */
const Fields = () => {
	return (
		<div>
			{ __( 'Here are the fields', 'genesis-custom-blocks' ) }
		</div>
	);
};

export default withSelect( ( select ) => {
	return {
		content: select( 'core/editor' ).getEditedPostContent(),
	};
} )( Fields );
