/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { ToggleControl } from '@wordpress/components';

const GcbToggleControl = ( props ) => {
	const { field, onChange, getValue } = props;
	let value = getValue( props );
	if ( 'undefined' === typeof value ) {
		value = field.default;
	}

	return (
		<ToggleControl
			label={ field.label }
			help={ field.help }
			checked={ value }
			onChange={ onChange }
		/>
	);
};

export default GcbToggleControl;
