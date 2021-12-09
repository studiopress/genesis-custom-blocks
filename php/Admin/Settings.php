<?php
/**
 * Genesis Custom Blocks Settings.
 *
 * @package   Genesis\CustomBlocksPro
 * @copyright Copyright(c) 2020, Genesis Custom Blocks Pro
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class Settings
 */
class Settings extends ComponentAbstract {

	/**
	 * Option name for the notices.
	 *
	 * @var string
	 */
	const NOTICES_OPTION_NAME = 'genesis_custom_blocks_notices';

	/**
	 * Settings name to opt in to analytics.
	 *
	 * @var string
	 */
	const ANALYTICS_OPT_IN = 'genesis_custom_blocks_analytics_opt_in';

	/**
	 * Page slug.
	 *
	 * @var string
	 */
	const PAGE_SLUG = 'genesis-custom-blocks-settings';

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_action( 'admin_menu', [ $this, 'add_submenu_pages' ] );
	}

	/**
	 * Add submenu pages to the Genesis Custom Blocks menu.
	 */
	public function add_submenu_pages() {
		add_submenu_page(
			'edit.php?post_type=' . genesis_custom_blocks()->get_post_type_slug(),
			__( 'Genesis Custom Blocks Settings', 'genesis-custom-blocks' ),
			__( 'Settings', 'genesis-custom-blocks' ),
			'manage_options',
			self::PAGE_SLUG,
			[ $this, 'render_page' ]
		);
	}

	/**
	 * Renders the Settings page.
	 */
	public function render_page() {
		?>
		<div class="wrap genesis-custom-blocks-settings">
			<?php
			/**
			 * Runs when rendering the page /wp-admin > Custom Blocks > Settings.
			 */
			do_action( 'genesis_custom_blocks_render_settings_page' );
			?>
		</div>
		<?php
	}
}
