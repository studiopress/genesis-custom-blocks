<?php
/**
 * WP Admin resources.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class Admin
 */
class Admin extends ComponentAbstract {

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
		$this->documentation = new Documentation();
		genesis_custom_blocks()->register_component( $this->documentation );

		$this->onboarding = new Onboarding();
		genesis_custom_blocks()->register_component( $this->onboarding );

		$this->upgrade = new Upgrade();
		genesis_custom_blocks()->register_component( $this->upgrade );

		$this->edit_block = new EditBlock();
		genesis_custom_blocks()->register_component( $this->edit_block );

		if ( defined( 'WP_LOAD_IMPORTERS' ) && WP_LOAD_IMPORTERS ) {
			$this->import = new Import();
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
