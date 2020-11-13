/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { SvgContainer } from '../components';

/**
 * The SpaceBar icon.
 *
 * @return {React.ReactElement} The SpaceBar icon.
 */
const SpaceBar = () => (
	<SvgContainer>
		<path fill="none" d="M0 0h24v24H0V0z"/>
		<path d="M18 9v4H6V9H4v6h16V9h-2z"/>
	</SvgContainer>
);

export default SpaceBar;
