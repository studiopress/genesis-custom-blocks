<?php
/**
 * Testing Blocks
 *
 * @package Genesis\CustomBlocks
 *
 * Plugin Name: Testing Blocks
 * Plugin URI: https://github.com/studiopress/genesis-custom-blocks
 * Author: Genesis Custom Blocks contributors
 */

// Make Genesis Custom Blocks look for templates in this plugin instead of a theme.
add_filter(
	'genesis_custom_blocks_template_path',
	static function( $path ) {
		unset( $path );
		return __DIR__;
	}
);
