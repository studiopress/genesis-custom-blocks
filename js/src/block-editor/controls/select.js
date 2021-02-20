/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const GcbSelectControl = ( props ) => {
	const { field, getValue, onChange } = props;

	if ( '' === field.default ) {
		field.options = [
			{ label: __( '– Select –', 'genesis-custom-blocks' ), value: '', disabled: true },
			...field.options,
		];
	}

	return (
		<SelectControl
			label={ field.label }
			help={ field.help }
			value={ getValue( props ) || field.default }
			options={ field.options }
			onChange={ onChange }
		/>
	);
};

export default GcbSelectControl;
