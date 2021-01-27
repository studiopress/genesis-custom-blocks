<?php
/**
 * Primary plugin file.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks;

use Genesis\CustomBlocks\Admin\Admin;
use Genesis\CustomBlocks\Admin\Onboarding;
use Genesis\CustomBlocks\Blocks\Loader;
use Genesis\CustomBlocks\PostTypes\BlockPost;

/**
 * Class Plugin
 */
class Plugin extends PluginAbstract {

	/**
	 * Utility methods.
	 *
	 * @var Util
	 */
	protected $util;

	/**
	 * The block post type.
	 *
	 * @var BlockPost
	 */
	public $block_post;

	/**
	 * WP Admin resources.
	 *
	 * @var Admin\Admin
	 */
	public $admin;

	/**
	 * Block loader.
	 *
	 * @var Blocks\Loader
	 */
	public $loader;

	/**
	 * Execute this as early as possible.
	 */
	public function init() {
		$this->util = new Util();
		$this->register_component( $this->util );
		$this->block_post = new BlockPost();
		$this->register_component( $this->block_post );

		$this->loader = new Loader();
		$this->register_component( $this->loader );

		register_activation_hook(
			$this->get_file(),
			function() {
				$onboarding = new Onboarding();
				$onboarding->plugin_activation();
			}
		);

		$this->require_helpers();
	}

	/**
	 * Execute this once plugins are loaded. (not the best place for all hooks)
	 */
	public function plugin_loaded() {
		$this->admin = new Admin();
		$this->register_component( $this->admin );
	}

	/**
	 * Requires deprecated functions.
	 *
	 * On a later priority to give other plugins the chance to load the functions.
	 */
	public function require_deprecated() {
		if ( ! function_exists( 'block_row' ) ) {
			require_once __DIR__ . '/Deprecated.php';
		}
	}

	/**
	 * Requires helper functions.
	 */
	private function require_helpers() {
		require_once __DIR__ . '/BlockApi.php';

		if ( function_exists( 'block_field' ) || function_exists( 'block_value' ) ) {
			return;
		}

		require_once __DIR__ . '/Helpers.php';

	}
}
