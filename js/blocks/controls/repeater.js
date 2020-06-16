/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BaseControl, Button } from '@wordpress/components';
/**
 * Internal dependencies
 */
import { RepeaterRows } from '../components';

const GcbRepeaterControl = ( props ) => {
	const { field, instanceId, onChange, parentBlock, parentBlockProps } = props;
	const { attributes, setAttributes } = parentBlockProps;
	const attr = { ...attributes };
	const value = attr[ field.name ];
	const defaultRows = new Array( field.min ? field.min : 1 ).fill( { '': '' } );
	const hasRows = value && value.hasOwnProperty( 'rows' );
	const rows = hasRows ? value.rows : defaultRows;

	/**
	 * Adds a new empty row, using { '': '' }.
	 *
	 * Simply using {} results in <ServerSideRender> not sending an empty row,
	 * and the empty row isn't rendered in the editor.
	 *
	 * @see https://github.com/studiopress/genesis-custom-blocks/issues/393
	 */
	const addEmptyRow = () => {
		const withAddedRow = rows.concat( { '': '' } );
		attr[ field.name ] = { rows: withAddedRow };
		setAttributes( attr );
	};

	if ( ! hasRows ) {
		onChange( { rows: defaultRows } );
	}

	return (
		<BaseControl className="genesis-custom-blocks-repeater" label={ field.label } id={ `gcb-repeater-${ instanceId }` } help={ field.help }>
			<RepeaterRows
				rows={ rows }
				field={ field }
				subFields={ field.sub_fields || defaultRows }
				parentBlockProps={ parentBlockProps }
				parentBlock={ parentBlock }
			/>
			<div className="genesis-custom-blocks-repeater--row-add">
				<Button
					key={ `${ field.name }-repeater-insert` }
					icon="insert"
					label={ __( 'Add new', 'genesis-custom-blocks' ) }
					onClick={ addEmptyRow }
					disabled={ !! field.max && rows.length >= field.max }
				/>
			</div>
		</BaseControl>
	);
};

export default GcbRepeaterControl;
