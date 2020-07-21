<?php
/**
 * Primary plugin file.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
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
	 * Whether there is a plugin conflict.
	 *
	 * @var bool
	 */
	private $is_conflict;

	/**
	 * Execute this as early as possible.
	 */
	public function init() {
		if ( $this->is_plugin_conflict() ) {
			add_action(
				'admin_notices',
				[ $this, 'plugin_conflict_notice' ]
			);

			return;
		}

		$this->util = new Util();
		$this->register_component( $this->util );
		$this->register_component( new BlockPost() );

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
		if ( $this->is_plugin_conflict() ) {
			return;
		}

		$this->admin = new Admin();
		$this->register_component( $this->admin );
	}

	/**
	 * Require the helper function files.
	 */
	public function require_helpers() {
		require_once __DIR__ . '/Helpers.php';
		require_once __DIR__ . '/BlockApi.php';
		require_once __DIR__ . '/Deprecated.php';
	}

	/**
	 * Gets whether there is a conflict from another plugin having the same functions.
	 *
	 * @return bool Whether there is a conflict.
	 */
	public function is_plugin_conflict() {
		if ( isset( $this->is_conflict ) ) {
			return $this->is_conflict;
		}

		$this->is_conflict = function_exists( 'block_field' ) && function_exists( 'block_value' );
		return $this->is_conflict;
	}

	/**
	 * An admin notice for another plugin being active.
	 */
	public function plugin_conflict_notice() {
		printf(
			'<div class="notice notice-error"><p>%1$s</p></div>',
			esc_html__( 'It looks like Block Lab is active. Please deactivate it, as Genesis Custom Blocks will not work while it is active.', 'genesis-custom-blocks' )
		);
	}
}
