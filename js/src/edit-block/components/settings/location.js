/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Select } from '../';

/**
 * @typedef {Object} LocationProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change to this setting.
 */

/**
 * The location component.
 *
 * @param {LocationProps} props The component props.
 * @return {React.ReactElement} The select component.
 */
const Location = ( props ) => {
	const locations = [
		{
			value: 'editor',
			label: __( 'Editor', 'genesis-custom-blocks' ),
		},
		{
			value: 'inspector',
			label: __( 'Inspector', 'genesis-custom-blocks' ),
		},
	];
	const id = `setting-${ props.setting.name }`;

	return <Select { ...props } id={ id } options={ locations } />;
};

export default Location;
