<?php
/**
 * Deprecated functions.
 *
 * Deprecated methods can also appear as functions here, with the format namespace__class__method().
 *
 * @see Genesis\CustomBlocks\ComponentAbstract->_call()
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2018, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

use function Genesis\CustomBlocks\add_block;
use function Genesis\CustomBlocks\add_field;

/**
 * Show a PHP error to warn developers using deprecated functions.
 *
 * @param string $function    The function that was called.
 * @param string $version     The version of Genesis Custom Blocks that deprecated the function.
 * @param string $replacement The function that should have been called.
 */
function genesis_custom_blocks_deprecated_function( $function, $version, $replacement ) {
	_deprecated_function(
		// filter_var is used for sanitization here as it allows arrow functions ("->").
		filter_var(
			sprintf(
				// translators: A function name.
				__( 'Genesis Custom Blocks\'s %1$s', 'genesis-custom-blocks' ),
				$function
			),
			FILTER_SANITIZE_STRING
		),
		esc_html( $version ),
		filter_var( $replacement, FILTER_SANITIZE_STRING )
	);
}

/**
 * Handle the deprecated block_lab_get_icons() function.
 *
 * @see \Genesis\CustomBlocks\Util->get_icons()
 *
 * @return array
 */
function block_lab_get_icons() {
	genesis_custom_blocks_deprecated_function( 'block_lab_get_icons', '1.3.5', 'genesis_custom_blocks()->get_icons()' );
	return genesis_custom_blocks()->get_icons();
}

/**
 * Handle the deprecated block_lab_allowed_svg_tags() function.
 *
 * @see \Genesis\CustomBlocks\Util->allowed_svg_tags()
 *
 * @return array
 */
function block_lab_allowed_svg_tags() {
	genesis_custom_blocks_deprecated_function( 'block_lab_allowed_svg_tags', '1.3.5', 'genesis_custom_blocks()->allowed_svg_tags()' );
	return genesis_custom_blocks()->allowed_svg_tags();
}

/**
 * Handle deprecated block_lab_add_block function.
 *
 * @param string $block_name   The block name (slug), like 'example-block'.
 * @param array  $block_config {
 *     An associative array containing the block configuration.
 *
 *     @type string   $title    The block title.
 *     @type string   $icon     The block icon. See assets/icons.json for a JSON array of all possible values. Default: 'genesis_custom_blocks'.
 *     @type string   $category The slug of a registered category. Categories include: common, formatting, layout, widgets, embed. Default: 'common'.
 *     @type array    $excluded Exclude the block in these post types. Default: [].
 *     @type string[] $keywords An array of up to three keywords. Default: [].
 *     @type array    $fields {
 *         An associative array containing block fields. Each key in the array should be the field slug.
 *
 *         @type array {$slug} {
 *             An associative array describing a field. Refer to the $field_config parameter of add_field().
 *         }
 *     }
 * }
 */
function block_lab_add_block( $block_name, $block_config = [] ) {
	genesis_custom_blocks_deprecated_function( 'block_lab_add_block', '1.5.4', 'Genesis\\CustomBlocks\\add_block()' );
	add_block( $block_name, $block_config );
}

/**
 * Handle deprecated block_lab_add_field function.
 *
 * @param string $block_name The block name (slug), like 'example-block'.
 * @param string $field_name The field name (slug), like 'first-name'.
 * @param array  $field_config {
 *     An associative array containing the field configuration.
 *
 *     @type string $name    The field name.
 *     @type string $label   The field label.
 *     @type string $control The field control type. Default: 'text'.
 *     @type int    $order   The order that the field appears in. Default: 0.
 *     @type array  $settings {
 *         An associative array of settings for the field. Each field has a different set of possible settings.
 *         Check the register_settings method for the field, found in php/blocks/controls/class-{field name}.php.
 *     }
 * }
 */
function block_lab_add_field( $block_name, $field_name, $field_config = [] ) {
	genesis_custom_blocks_deprecated_function( 'block_lab_add_field', '1.5.4', 'Genesis\\CustomBlocks\\add_field()' );
	add_field( $block_name, $field_name, $field_config );
}
