/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { BaseControl, TextControl, Popover, ColorIndicator, ColorPicker } from '@wordpress/components';
import { withState } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

const GcbColorPopover = withState( {
} )( ( { isVisible, color, onUpdate, setState } ) => {
	const toggleVisible = () => {
		setState( ( state ) => ( { isVisible: ! state.isVisible } ) );
	};
	const colorChange = ( value ) => {
		let newColor = value.hex;
		if ( value.rgb.a < 1 ) {
			newColor = 'rgba(' + value.rgb.r + ', ' + value.rgb.g + ', ' + value.rgb.b + ', ' + value.rgb.a + ')';
		}
		setState( () => ( { color: newColor } ) );
		onUpdate( newColor );
	};

	return (
		<BaseControl
			className="genesis-custom-blocks-color-popover"
			id={ __( 'Color control picker', 'genesis-custom-blocks' ) }
		>
			<ColorIndicator
				colorValue={ color }
				onMouseDown={ ( event ) => {
					event.preventDefault(); // Prevent the popover blur.
				} }
				onClick={ toggleVisible }
			>
				{ isVisible && (
					<Popover
						onClick={ ( event ) => {
							event.stopPropagation();
						} }
						onBlur={ ( event ) => {
							if ( null === event.relatedTarget ) {
								return;
							}
							if ( event.relatedTarget.classList.contains( 'wp-block' ) ) {
								toggleVisible();
							}
						} }
					>
						<ColorPicker
							color={ color }
							onChangeComplete={ ( value ) => {
								colorChange( value );
							} }
						/>
					</Popover>
				) }
			</ColorIndicator>
		</BaseControl>
	);
} );

const GcbColorControl = ( props ) => {
	const { field, getValue, onChange } = props;
	const initialValue = getValue( props );
	const value = 'undefined' !== typeof initialValue ? initialValue : field.default;
	const id = `gcb-color-${ field ? field.name : '' }`;

	return (
		<BaseControl label={ field.label } id={ id } className="genesis-custom-blocks-color-control" help={ field.help }>
			<TextControl
				id={ id }
				value={ value }
				onChange={ onChange }
			/>
			<GcbColorPopover
				isVisible={ false }
				color={ value }
				onUpdate={ onChange }
			/>
		</BaseControl>
	);
};

export default GcbColorControl;
