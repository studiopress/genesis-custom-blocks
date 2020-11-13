/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { SvgContainer } from '../components';

/**
 * The Announcement icon.
 *
 * @return {React.ReactElement} The Announcement icon.
 */
const Announcement = () => (
	<SvgContainer>
		<path fill="none" d="M0 0h24v24H0V0z"/>
		<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM11 5h2v6h-2zm0 8h2v2h-2z"/>
	</SvgContainer>
);

export default Announcement;
