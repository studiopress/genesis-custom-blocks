/**
 * External dependencies
 */
import React from 'react';

/**
 * An SVG container.
 *
 * @return {React.ReactElement} The SVG container.
 */
const SvgContainer = ( { children } ) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		{ children }
	</svg>
);

export default SvgContainer;
