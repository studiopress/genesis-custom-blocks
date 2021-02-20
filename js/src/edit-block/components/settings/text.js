/**
 * External dependencies
 */
import * as React from 'react';

/**
 * Internal dependencies
 */
import { Input } from '../';

/**
 * @typedef {Object} TextProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change in this setting.
 */

/**
 * The text component.
 *
 * @param {TextProps} props The component props.
 * @return {React.ReactElement} The text component.
 */
const Text = ( props ) => {
	return <Input { ...props } type="text" />;
};

export default Text;
