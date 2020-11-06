/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { Input } from '../';

/**
 * @typedef {Object} NumberNonNegativeProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change in this setting.
 */

/**
 * The number non-negative component.
 *
 * @param {NumberNonNegativeProps} props The component props.
 * @return {React.ReactElement} The number non-negative component.
 */
const NumberNonNegative = ( props ) => {
	return <Input { ...props } type="number" min={ 0 } />;
};

export default NumberNonNegative;
