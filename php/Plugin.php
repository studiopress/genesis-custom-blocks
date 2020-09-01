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
	}

	/**
	 * Execute this once plugins are loaded. (not the best place for all hooks)
	 */
	public function plugin_loaded() {
		$this->admin = new Admin();
		$this->register_component( $this->admin );
		$this->require_api();
		$this->require_helpers();
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
	 * Require the API functions.
	 */
	private function require_api() {
		require_once __DIR__ . '/BlockApi.php';
	}


	/**
	 * Requires helper functions.
	 */
	private function require_helpers() {
		if ( $this->is_plugin_conflict() ) {
			add_action( 'admin_notices', [ $this, 'plugin_conflict_notice' ] );
		} else {
			require_once __DIR__ . '/Helpers.php';
		}
	}

	/**
	 * Gets whether there is a conflict from another plugin having the same functions.
	 *
	 * @return bool Whether there is a conflict.
	 */
	public function is_plugin_conflict() {
		return function_exists( 'block_field' ) || function_exists( 'block_value' );
	}

	/**
	 * An admin notice for another plugin being active.
	 */
	public function plugin_conflict_notice() {
		if ( ! current_user_can( 'deactivate_plugins' ) ) {
			return;
		}

		$plugin_file      = 'block-lab/block-lab.php';
		$deactivation_url = add_query_arg(
			[
				'action'        => 'deactivate',
				'plugin'        => rawurlencode( $plugin_file ),
				'plugin_status' => 'all',
				'paged'         => 1,
				'_wpnonce'      => wp_create_nonce( 'deactivate-plugin_' . $plugin_file ),
			],
			admin_url( 'plugins.php' )
		);

		?>
		<style>
			.gcb-notice-conflict {
				display: flex;
				padding-top: 0.2rem;
				padding-bottom: 0.2rem;
			}

			.gcb-notice-conflict .gcb-conflict-copy {
				margin-right: auto;
			}

			.gcb-notice-conflict .gcb-link-deactivate {
				margin: auto 0.2rem;
			}
		</style>
		<div id="gcb-conflict-notice" class="notice notice-error gcb-notice-conflict">
			<div class="gcb-conflict-copy">
				<p><?php esc_html_e( 'It looks like Block Lab is active. Please deactivate it or migrate, as it will not work while Genesis Custom Blocks is active.', 'genesis-custom-blocks' ); ?></p>
			</div>
			<?php
			if ( current_user_can( 'deactivate_plugins' ) ) :
				?>
				<a href="<?php echo esc_url( $deactivation_url ); ?>" class="gcb-link-deactivate button button-primary">
					<?php echo esc_html_x( 'Deactivate', 'plugin', 'genesis-custom-blocks' ); ?>
				</a>
			<?php endif; ?>
		</div>
		<?php
	}
}
