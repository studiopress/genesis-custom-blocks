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

const GcbColorControl = ( props ) => {
	const { field, getValue, onChange } = props;
	const initialValue = getValue( props );
	const [ isVisible, setIsVisible ] = useState( false );
	const handleColorChange = ( newValue ) => {
		let newColor = newValue.hex;
		if ( newValue.rgb.a < 1 ) {
			newColor = 'rgba(' + newValue.rgb.r + ', ' + newValue.rgb.g + ', ' + newValue.rgb.b + ', ' + newValue.rgb.a + ')';
		}

		onChange( newColor );
	};

	const value = 'undefined' !== typeof initialValue ? initialValue : field.default;
	const id = `gcb-color-${ field ? field.name : '' }`;

	return (
		<BaseControl label={ field.label } id={ id } className="genesis-custom-blocks-color-control" help={ field.help }>
			<TextControl
				id={ id }
				value={ value }
				onChange={ onChange }
			/>
			<BaseControl
				className="genesis-custom-blocks-color-popover"
				id={ __( 'Color control picker', 'genesis-custom-blocks' ) }
			>
				<ColorIndicator
					colorValue={ value }
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
							color={ value }
							onChangeComplete={ ( newValue ) => {
								handleColorChange( newValue );
							} }
						/>
					</Popover>
				) : null
			}
		</BaseControl>
	);
};

export default GcbColorControl;
