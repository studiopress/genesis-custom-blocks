/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components';

const GcbTextControl = ( props ) => {
	const { field, getValue, onChange } = props;
	const initialValue = getValue( props );
	const value = 'undefined' !== typeof initialValue ? initialValue : field.default;

	return (
		<TextControl
			label={ field.label }
			placeholder={ field.placeholder || '' }
			maxLength={ field.maxlength }
			help={ field.help }
			value={ value }
			onChange={ onChange }
		/>
	);
};

export default GcbTextControl;
