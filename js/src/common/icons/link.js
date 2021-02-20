/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { SvgContainer } from '../components';

/**
 * The Link icon.
 *
 * @return {React.ReactElement} The Link icon.
 */
const Link = () => (
	<SvgContainer>
		<path fill="none" d="M0 0h24v24H0V0z" />
		<path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z" />
	</SvgContainer>
);

export default Link;
