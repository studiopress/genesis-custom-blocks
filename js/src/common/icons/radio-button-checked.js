/**
 * External dependencies
 */
import * as React from 'react';

/**
 * Internal dependencies
 */
import { SvgContainer } from '../components';

/**
 * The RadioButtonChecked icon.
 *
 * @return {React.ReactElement} The RadioButtonChecked icon.
 */
const RadioButtonChecked = () => (
	<SvgContainer>
		<path fill="none" d="M0 0h24v24H0V0z" />
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /><circle cx="12" cy="12" r="5" />
	</SvgContainer>
);

export default RadioButtonChecked;
