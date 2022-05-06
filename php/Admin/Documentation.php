<?php
/**
 * Genesis Custom Blocks Documentation.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class Documentation
 */
class Documentation extends ComponentAbstract {

	/**
	 * Page slug.
	 *
	 * @var string
	 */
	public $slug = 'genesis-custom-blocks-documentation';

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_action( 'admin_menu', [ $this, 'add_submenu_page' ] );
		add_action( 'admin_init', [ $this, 'maybe_redirect' ] );
		add_action( 'allowed_redirect_hosts', [ $this, 'add_redirect_host' ] );
	}

	/**
	 * Add submenu pages to the Genesis Custom Blocks menu.
	 */
	public function add_submenu_page() {
		$menu_title = __( 'Documentation', 'genesis-custom-blocks' );
		add_submenu_page(
			'edit.php?post_type=' . genesis_custom_blocks()->get_post_type_slug(),
			$menu_title,
			$menu_title,
			'manage_options',
			$this->slug,
			'__return_false' // Needed so the menu URL is correct.
		);
	}

	/**
	 * Add submenu pages to the Genesis Custom Blocks menu.
	 */
	public function maybe_redirect() {
		$page = filter_input( INPUT_GET, 'page' );

		if ( $this->slug === $page ) {
			wp_safe_redirect( 'https://developer.wpengine.com/genesis-custom-blocks/' );
			exit();
		}
	}

	/**
	 * Adds an allowed redirect host.
	 *
	 * @param string[] $allowed_hosts The allowed redirect hosts.
	 * @return string[] The filtered allowed hosts.
	 */
	public function add_redirect_host( $allowed_hosts ) {
		return array_merge( $allowed_hosts, [ 'developer.wpengine.com' ] );
	}
}
