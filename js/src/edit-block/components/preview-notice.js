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
import { Notice } from './';

/**
 * @typedef {Object} PreviewNoticeProps The component props.
 * @property {React.ReactChild} children The children.
 */

/**
 * A notice to add blocks in order to preview them.
 *
 * @param {PreviewNoticeProps} props
 * @return {React.ReactElement} The preview notice.
 */
const PreviewNotice = ( { children } ) => (
	<Notice className="mt-2">
		{ __( 'To preview this, please edit the block in the', 'genesis-custom-blocks' ) }
		&nbsp;
		{ children }
		&nbsp;
		{ __( 'and save', 'genesis-custom-blocks' ) }
	</Notice>
);

export default PreviewNotice;
