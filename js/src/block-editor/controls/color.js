/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { BaseControl, ColorIndicator, ColorPicker, Popover, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const GcbColorPopover = ( { color, onUpdate } ) => {
	const [ isVisible, setIsVisible ] = useState( false );
	const handleColorChange = ( value ) => {
		let newColor = value.hex;
		if ( value.rgb.a < 1 ) {
			newColor = 'rgba(' + value.rgb.r + ', ' + value.rgb.g + ', ' + value.rgb.b + ', ' + value.rgb.a + ')';
		}
		onUpdate( newColor );
	};

	return (
		<>
			<BaseControl
				className="genesis-custom-blocks-color-popover"
				id={ __( 'Color control picker', 'genesis-custom-blocks' ) }
			>
				<ColorIndicator
					colorValue={ color }
					onMouseDown={ ( event ) => {
						event.preventDefault(); // Prevent the popover blur.
					} }
					onClick={ () => setIsVisible( true ) }
				/>
			</BaseControl>
			{ isVisible
				? (
					<Popover
						onClick={ ( event ) => event.stopPropagation() }
						onClose={ () => setIsVisible( false ) }
					>
						<ColorPicker
							color={ color }
							onChangeComplete={ ( value ) => {
								handleColorChange( value );
							} }
						/>
					</Popover>
				) : null
			}
		</>
	);
};

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
				color={ value }
				onUpdate={ onChange }
			/>
		</BaseControl>
	);
};

export default GcbColorControl;
