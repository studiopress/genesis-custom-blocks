<?php
/**
 * Genesis Custom Blocks
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 *
 * Plugin Name: Genesis Custom Blocks
 * Description: The easy way to build custom blocks for Gutenberg.
 * Version: 1.7.0
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

require_once __DIR__ . '/vendor/autoload.php';

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
 * Set up the plugin instance.
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
