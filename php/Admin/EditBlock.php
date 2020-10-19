<?php
/**
 * The 'Edit Block' submenu page.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use WP_Post;
use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class EditBlock
 */
class EditBlock extends ComponentAbstract {

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_filter( 'replace_editor', [ $this, 'should_replace_editor' ], 10, 2 );
		add_filter( 'use_block_editor_for_post_type', [ $this, 'should_use_block_editor_for_post_type' ] );
		add_action( 'admin_footer', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Whether this should replace the native editor.
	 *
	 * @param bool    $replace Whether to replace the editor.
	 * @param WP_Post $post The current post.
	 * @return bool Whether this should replace the editor.
	 */
	public function should_replace_editor( $replace, $post ) {
		if ( genesis_custom_blocks()->get_post_type_slug() === get_post_type( $post ) ) {
			return true;
		}

		return $replace;
	}

	/**
	 * Whether to use the block editor for a given post type.
	 *
	 * @param bool   $use_block_editor Whether this should use the block editor.
	 * @param string $post_type      The post type.
	 * @return bool Whether this should use the block editor.
	 */
	public function should_use_block_editor_for_post_type( $use_block_editor, $post_type ) {
		if ( genesis_custom_blocks()->get_post_type_slug() === $post_type ) {
			return false;
		}

		return $use_block_editor;
	}

	/**
	 * Enqueues the assets.
	 *
	 * The action 'admin_enqueue_scripts' does not run for the 'Edit Block' page,
	 * as the native editor is disabled.
	 */
	public function enqueue_assets() {
		$screen = get_current_screen();

		if ( genesis_custom_blocks()->get_post_type_slug() !== $screen->post_type || 'post' !== $screen->base ) {
			return;
		}

		$script_slug   = 'genesis-custom-blocks-edit-block-script';
		$script_config = require $this->plugin->get_path( 'js/dist/edit-block.asset.php' );
		wp_enqueue_script(
			$script_slug,
			$this->plugin->get_url( 'js/edit-block.js' ),
			$script_config['dependencies'],
			$script_config['version'],
			true
		);
	}
}
