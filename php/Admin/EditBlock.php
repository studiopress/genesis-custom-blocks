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
	 * The slug of the script.
	 *
	 * @var string
	 */
	const SCRIPT_SLUG = 'genesis-custom-blocks-edit-block-script';

	/**
	 * The slug of the style.
	 *
	 * @var string
	 */
	const STYLE_SLUG = 'genesis-custom-blocks-edit-block-style';

	/**
	 * The slug of tailwind.
	 *
	 * @var string
	 */
	const TAILWIND_SLUG = 'genesis-custom-blocks-tailwind';

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_filter( 'replace_editor', [ $this, 'should_replace_editor' ], 10, 2 );
		add_filter( 'use_block_editor_for_post_type', [ $this, 'should_use_block_editor_for_post_type' ], 10, 2 );
		add_action( 'admin_footer', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Gets whether this should replace the native editor.
	 *
	 * @param bool    $replace Whether to replace the editor.
	 * @param WP_Post $post    The current post.
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
	 * @param string $post_type        The post type.
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

		if (
			! is_object( $screen ) ||
			genesis_custom_blocks()->get_post_type_slug() !== $screen->post_type ||
			'post' !== $screen->base
		) {
			return;
		}

		$js_config = require $this->plugin->get_path( 'js/dist/edit-block.asset.php' );
		wp_enqueue_script(
			self::SCRIPT_SLUG,
			$this->plugin->get_url( 'js/dist/edit-block.js' ),
			$js_config['dependencies'],
			$js_config['version'],
			true
		);

		wp_add_inline_script(
			self::SCRIPT_SLUG,
			sprintf(
				'const gcbEditor = %s;',
				wp_json_encode(
					[
						'postType'     => get_post_type(),
						'postId'       => get_the_ID(),
						'settings'     => [
							'titlePlaceholder' => __( 'Block title', 'genesis-custom-blocks' ),
						],
						'initialEdits' => null,
						'controls'     => genesis_custom_blocks()->block_post->get_controls(),
					]
				)
			),
			'before'
		);

		wp_enqueue_style(
			self::STYLE_SLUG,
			$this->plugin->get_url( 'css/edit-block.css' ),
			[ 'wp-components' ],
			$this->plugin->get_version()
		);

		// @todo: get only the style rules that are needed, and add them to a CSS file in this plugin.
		wp_enqueue_style(
			self::TAILWIND_SLUG,
			'https://unpkg.com/tailwindcss@1.9.6/dist/tailwind.min.css',
			[],
			$this->plugin->get_version()
		);
	}
}
