/**
 * External dependencies
 */
import React from 'react';

/**
 * The Today icon.
 *
 * @return {React.ReactElement} The Today icon.
 */
const Today = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<path fill="none" d="M0 0h24v24H0V0z" />
			<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zM7 11h5v5H7z" />
		</svg>
	);
};

export default Today;
