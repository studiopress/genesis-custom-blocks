<?php
/**
 * Block API helper functions.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks;

/**
 * Add a new block.
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
function add_block( $block_name, $block_config = [] ) {
	$block_config['name'] = str_replace( '_', '-', sanitize_title( $block_name ) );

	$default_config = [
		'title'    => str_replace( '-', ' ', ucwords( $block_config['name'], '-' ) ),
		'icon'     => 'genesis_custom_blocks',
		'category' => 'common',
		'excluded' => [],
		'keywords' => [],
		'fields'   => [],
	];

	$block_config = wp_parse_args( $block_config, $default_config );
	genesis_custom_blocks()->loader->add_block( $block_config );
}

/**
 * Add a field to a block.
 *
 * @param string $block_name   The block name (slug), like 'example-block'.
 * @param string $field_name   The field name (slug), like 'first-name'.
 * @param array  $field_config {
 *     An associative array containing the field configuration.
 *
 *     @type string $name    The field name.
 *     @type string $label   The field label.
 *     @type string $control The field control type. Default: 'text'.
 *     @type int    $order   The order that the field appears in. Default: 0.
 *     @type array  $settings {
 *         An associative array of settings for the field. Each field has a different set of possible settings.
 *         Check the register_settings method for the field, found in php/Blocks/Controls/{field name}.php.
 *     }
 * }
 */
function add_field( $block_name, $field_name, $field_config = [] ) {
	$field_config['name'] = str_replace( '_', '-', sanitize_title( $field_name ) );

	$default_config = [
		'label'    => str_replace( '-', ' ', ucwords( $field_config['name'], '-' ) ),
		'control'  => 'text',
		'order'    => 0,
		'settings' => [],
	];

	$field_config = wp_parse_args( $field_config, $default_config );
	genesis_custom_blocks()->loader->add_field( $block_name, $field_config );
}
