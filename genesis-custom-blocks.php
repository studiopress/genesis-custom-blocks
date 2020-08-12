<?php
/**
 * Genesis Custom Blocks
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 *
 * Plugin Name: Genesis Custom Blocks
 * Plugin URI: https://studiopress.com
 * Description: The easy way to build custom blocks for Gutenberg.
 * Version: 1.0.0
 * Author: Genesis Custom Blocks
 * Author URI: https://studiopress.com
 * License: GPL2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: genesis-custom-blocks
 * Domain Path: languages
 */

use Genesis\CustomBlocks\Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once dirname( __FILE__ ) . '/vendor/autoload.php';

/**
 * Admin notice for incompatible versions of PHP.
 */
function genesis_custom_blocks_php_version_error() {
	printf( '<div class="error"><p>%s</p></div>', esc_html( genesis_custom_blocks_php_version_text() ) );
}

/**
 * String describing the minimum PHP version.
 *
 * "Namespace" is a PHP 5.3 introduced feature. This is a hard requirement
 * for the plugin structure.
 *
 * "Traits" is a PHP 5.4 introduced feature. Remove "Traits" support from
 * php/autoloader if you want to support a lower PHP version.
 * Remember to update the checked version below if you do.
 *
 * @return string
 */
function genesis_custom_blocks_php_version_text() {
	return __( 'Genesis Custom Blocks plugin error: Your version of PHP is too old to run this plugin. You must be running PHP 5.4 or higher.', 'genesis-custom-blocks' );
}

// If the PHP version is too low, show warning and return.
if ( version_compare( phpversion(), '5.4', '<' ) ) {
	if ( defined( 'WP_CLI' ) ) {
		WP_CLI::warning( genesis_custom_blocks_php_version_text() );
	} else {
		add_action( 'admin_notices', 'genesis_custom_blocks_php_version_error' );
	}

	return;
}

/**
 * Admin notice for incompatible versions of WordPress or missing Gutenberg Plugin.
 */
function genesis_custom_blocks_wp_version_error() {
	printf( '<div class="error"><p>%s</p></div>', esc_html( genesis_custom_blocks_wp_version_text() ) );
}

/**
 * String describing the minimum WP version or Gutenberg Plugin requirement.
 *
 * "Blocks" are a feature of WordPress 5.0+ or require the Gutenberg plugin.
 *
 * @return string
 */
function genesis_custom_blocks_wp_version_text() {
	return __( 'Genesis Custom Blocks plugin error: Your version of WordPress is too old. You must be running WordPress 5.0 to use Genesis Custom Blocks.', 'genesis-custom-blocks' );
}

// If the WordPress version is too low, show warning and return.
if ( ! function_exists( 'register_block_type' ) ) {
	if ( defined( 'WP_CLI' ) ) {
		WP_CLI::warning( genesis_custom_blocks_wp_version_text() );
	} else {
		add_action( 'admin_notices', 'genesis_custom_blocks_wp_version_error' );
	}
}

/**
 * Get the plugin object.
 *
 * @return Plugin
 */
function genesis_custom_blocks() {
	static $instance;

	if ( null === $instance ) {
		$instance = new Plugin();
	}

	return $instance;
}

/**
 * Setup the plugin instance.
 */
genesis_custom_blocks()
	->set_basename( plugin_basename( __FILE__ ) )
	->set_directory( plugin_dir_path( __FILE__ ) )
	->set_file( __FILE__ )
	->set_slug( 'genesis-custom-blocks' )
	->set_url( plugin_dir_url( __FILE__ ) )
	->set_version( __FILE__ )
	->init();

add_action( 'plugins_loaded', [ genesis_custom_blocks(), 'plugin_loaded' ] );
add_action( 'plugins_loaded', [ genesis_custom_blocks(), 'require_deprecated' ], 11 );
