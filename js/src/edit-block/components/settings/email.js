/**
 * External dependencies
 */
import * as React from 'react';

/**
 * Internal dependencies
 */
import { Input } from '../';

/**
 * @typedef {Object} EmailProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change in this setting.
 */

/**
 * The number component.
 *
 * @param {EmailProps} props The component props.
 * @return {React.ReactElement} The number component.
 */
const Email = ( props ) => {
	return <Input { ...props } type="email" />;
};

export default Email;
