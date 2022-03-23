<?php
/**
 * Genesis Custom Blocks Settings.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
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
	 * Settings group to opt into analytics.
	 *
	 * @var string
	 */
	const SETTINGS_GROUP = 'genesis-custom-blocks-settings-page';

	/**
	 * Option name to opt into analytics.
	 *
	 * @var string
	 */
	const ANALYTICS_OPTION_NAME = 'genesis_custom_blocks_analytics_opt_in';

	/**
	 * The value when a user has opted into analytics.
	 *
	 * @var string
	 */
	const ANALYTICS_OPTED_IN_VALUE = 'genesis_custom_blocks_analytics_opt_in';

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
		add_action( 'admin_init', [ $this, 'register_settings' ] );
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
		include genesis_custom_blocks()->get_path() . 'php/Views/Settings.php';
	}

	/**
	 * Register Genesis Custom Blocks settings.
	 */
	public function register_settings() {
		register_setting( self::SETTINGS_GROUP, self::ANALYTICS_OPTION_NAME );
	}
}
