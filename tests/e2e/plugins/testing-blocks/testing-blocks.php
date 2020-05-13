<?php
/**
 * Testing Blocks
 *
 * @package GenesisCustomBlocks
 *
 * Plugin Name: Testing Blocks
 * Plugin URI: https://github.com/studiopress/genesis-custom-blocks
 * Author: Genesis Custom Blocks contributors
 */

// Make Block Lab look for templates in this plugin instead of a theme.
add_filter(
	'block_lab_template_path',
	static function( $path ) {
		unset( $path );
		return __DIR__;
	}
);
