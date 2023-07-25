<?php
/**
 * Helper functions.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

use Genesis\CustomBlocks\Blocks\Field;

/**
 * Return the value of a block field.
 *
 * @param string $name The name of the field.
 * @param bool   $is_echo Whether to echo and return the field, or just return the field.
 *
 * @return mixed
 */
function block_field( $name, $is_echo = true ) {
	$attributes = genesis_custom_blocks()->loader->get_data( 'attributes' );
	$config     = genesis_custom_blocks()->loader->get_data( 'config' );

	if ( ! $config ) {
		return null;
	}

	$default_fields = [ 'className' => 'string' ];

	/**
	 * Filters the default fields that are allowed in addition to Genesis Custom Blocks fields.
	 *
	 * Adding an attribute to this can enable outputting it via block_field().
	 * Normally, this function only returns or echoes Genesis Custom Blocks attributes (fields), and one default field.
	 * But this allows getting block attributes that might have been added by other plugins or JS.
	 * To allow getting another attribute, add it to the $default_fields associative array.
	 * For example, 'your-example-field' => 'array'.
	 *
	 * @param array  $default_fields An associative array of $field_name => $field_type.
	 * @param string $name The name of value to get.
	 */
	$default_fields = apply_filters( 'genesis_custom_blocks_default_fields', $default_fields, $name );

	if ( ! isset( $config->fields[ $name ] ) && ! isset( $default_fields[ $name ] ) ) {
		return null;
	}

	$field   = null;
	$value   = false; // This is a good default, it allows us to pick up on unchecked checkboxes.
	$control = null;

	if ( is_array( $attributes ) && array_key_exists( $name, $attributes ) ) {
		$value = $attributes[ $name ];
	}

	if ( isset( $config->fields[ $name ] ) ) {
		// Cast the value with the correct type.
		$field   = $config->fields[ $name ];
		$value   = $field->cast_value( $value );
		$control = $field->control;
	} elseif ( isset( $default_fields[ $name ] ) ) {
		// Cast default Editor attributes and those added via a filter.
		$field = new Field( [ 'type' => $default_fields[ $name ] ] );
		$value = $field->cast_value( $value );
	}

	/**
	 * Filters the value to be made available or echoed on the front-end template.
	 *
	 * @param mixed       $value   The value.
	 * @param string|null $control The type of the control, like 'user', or null if this is the 'className', which has no control.
	 * @param bool        $is_echo    Whether or not this value will be echoed.
	 */
	$value = apply_filters( 'genesis_custom_blocks_field_value', $value, $control, $is_echo );

	if ( $is_echo ) {
		if ( $field ) {
			$value = $field->cast_value_to_string( $value );
		}

		/*
		 * Escaping this value may cause it to break in some use cases.
		 * If this happens, retrieve the field's value using block_value(),
		 * and then output the field with a more suitable escaping function.
		 */
		echo wp_kses_post( $value );

		return null;
	}

	return $value;
}

/**
 * Return the value of a block field, without echoing it.
 *
 * @param string $name The name of the field as created in the UI.
 *
 * @uses block_field()
 *
 * @return mixed
 */
function block_value( $name ) {
	return block_field( $name, false );
}

/**
 * Convenience method to return the block configuration.
 *
 * @return array
 */
function block_config() {
	$config = genesis_custom_blocks()->loader->get_data( 'config' );

	if ( ! $config ) {
		return null;
	}

	return (array) $config;
}

/**
 * Convenience method to return a field's configuration.
 *
 * @param string $name The name of the field as created in the UI.
 *
 * @return array|null
 */
function block_field_config( $name ) {
	$config = genesis_custom_blocks()->loader->get_data( 'config' );

	if ( ! $config || ! isset( $config->fields[ $name ] ) ) {
		return null;
	}

	return (array) $config->fields[ $name ];
}
