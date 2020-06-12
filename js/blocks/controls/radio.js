/**
 * WordPress dependencies
 */
import { RadioControl } from '@wordpress/components';

const GcbRadioControl = ( props ) => {
	const { field, getValue, onChange } = props;

	return (
		<RadioControl
			label={ field.label }
			help={ field.help }
			selected={ getValue( props ) || field.default }
			options={ field.options }
			onChange={ onChange }
		/>
	);
};

export default GcbRadioControl;
