// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { Input } from '../';

/**
 * @typedef {Object} MaxlengthProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 */

/**
 * The field settings.
 *
 * @param {MaxlengthProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Maxlength = ( props ) => {
	return <Input { ...props } type="number" />;
};

export default Maxlength;
