/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { Input } from '../';

/**
 * @typedef {Object} NumberProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change in this setting.
 */

/**
 * The field settings.
 *
 * @param {NumberProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Number = ( props ) => {
	return <Input { ...props } type="number" />;
};

export default Number;
