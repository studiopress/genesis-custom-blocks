<?php
/**
 * WP Admin resources.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class Admin
 */
class Admin extends ComponentAbstract {

	/**
	 * Plugin settings.
	 *
	 * @var Settings
	 */
	public $settings;

	/**
	 * Plugin documentation.
	 *
	 * @var Documentation
	 */
	public $documentation;

	/**
	 * User onboarding.
	 *
	 * @var Onboarding
	 */
	public $onboarding;

	/**
	 * Plugin upgrade.
	 *
	 * @var Upgrade
	 */
	public $upgrade;

	/**
	 * The 'Edit Block' UI.
	 *
	 * @var EditBlock
	 */
	public $edit_block;

	/**
	 * JSON import.
	 *
	 * @var Import
	 */
	public $import;

	/**
	 * Initialise the Admin component.
	 */
	public function init() {
		global $wp_filesystem;

		$this->settings = new Settings();
		genesis_custom_blocks()->register_component( $this->settings );

		$this->documentation = new Documentation();
		genesis_custom_blocks()->register_component( $this->documentation );

		$this->edit_block = new EditBlock();
		genesis_custom_blocks()->register_component( $this->edit_block );

		$this->onboarding = new Onboarding();
		genesis_custom_blocks()->register_component( $this->onboarding );

		$this->upgrade = new Upgrade();
		genesis_custom_blocks()->register_component( $this->upgrade );

		if ( defined( 'WP_LOAD_IMPORTERS' ) && WP_LOAD_IMPORTERS ) {
			// Ensure WP_Filesystem() is defined.
			require_once ABSPATH . 'wp-admin/includes/file.php';
			WP_Filesystem();
			$this->import = new Import( $wp_filesystem );
			genesis_custom_blocks()->register_component( $this->import );
		}
	}

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Enqueue scripts and styles used globally in the WP Admin.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_style(
			'genesis-custom-blocks',
			$this->plugin->get_url( 'css/admin.css' ),
			[],
			$this->plugin->get_version()
		);
	}
}
