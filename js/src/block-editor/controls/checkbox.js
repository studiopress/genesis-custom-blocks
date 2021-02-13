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
	let value = getValue( props );
	if ( 'undefined' === typeof value ) {
		value = field.default || false;
	}

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
