/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { CheckboxControl } from '@wordpress/components';

const GcbCheckboxControl = ( props ) => {
	const { field, getValue, onChange } = props;
	const initialValue = getValue( props );
	const value = 'undefined' !== typeof initialValue ? initialValue : field.default;

	return (
		<CheckboxControl
			label={ field.label }
			help={ field.help }
			checked={ value }
			onChange={ onChange }
		/>
	);
};

export default GcbCheckboxControl;
