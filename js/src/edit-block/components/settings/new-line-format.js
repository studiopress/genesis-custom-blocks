/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Select } from '../';

/**
 * @typedef {Object} NewLineFormatProps The component props.
 * @property {import('../editor').Setting} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change to this setting.
 */

/**
 * The new line format component.
 *
 * @param {NewLineFormatProps} props The component props.
 * @return {React.ReactElement} The new line format component.
 */
const NewLineFormat = ( props ) => {
	const id = `setting-${ props.setting.name }`;
	const options = [
		{
			value: 'autop',
			label: __( 'Automatically add paragraphs', 'genesis-custom-blocks' ),
		},
		{
			value: 'autobr',
			label: __( 'Automatically add line breaks', 'genesis-custom-blocks' ),
		},
		{
			value: 'none',
			label: __( 'No formatting', 'genesis-custom-blocks' ),
		},
	];

	return <Select { ...props } id={ id } options={ options } />;
};

export default NewLineFormat;
