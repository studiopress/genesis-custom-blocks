/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TinyMCE } from '../components';

const BlockLabClassicTextControl = ( props ) => {
	const { field, getValue, instanceId, onChange, parentBlockProps, rowIndex } = props;
	const { clientId } = parentBlockProps;
	const editorId = 'number' === typeof rowIndex ? `gcb-${ clientId }-${ field.name }-rowIndex-${ rowIndex }` : `gcb-${ clientId }-${ field.name }`;
	const initialValue = getValue( props );
	const value = 'undefined' !== typeof initialValue ? initialValue : field.default;

	return (
		<BaseControl
			label={ field.label }
			id={ `gcb-classic-text-${ instanceId }` }
			className="genesis-custom-blocks-classic-text-control"
			help={ field.help }
		>
			<TinyMCE
				content={ value }
				onChange={ onChange }
				editorId={ editorId }
			/>
		</BaseControl>
	);
};

export default BlockLabClassicTextControl;
