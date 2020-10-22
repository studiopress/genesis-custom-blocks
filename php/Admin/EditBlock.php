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
		add_filter( 'use_block_editor_for_post_type', [ $this, 'should_use_block_editor_for_post_type' ], 10, 2 );
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
	 * Forked from Core.
	 * The action 'admin_enqueue_scripts' does not run for the 'Edit Block' page,
	 * as the native editor is disabled.
	 */
	public function enqueue_assets() {
		global $post, $post_type, $post_type_object;
		$screen = get_current_screen();

		if (
			! is_object( $screen ) ||
			genesis_custom_blocks()->get_post_type_slug() !== $screen->post_type ||
			'post' !== $screen->base
		) {
			return;
		}

		$rest_base = ! empty( $post_type_object->rest_base ) ? $post_type_object->rest_base : $post_type_object->name;

		// Preload common data.
		$preload_paths = [
			'/',
			'/wp/v2/types?context=edit',
			'/wp/v2/taxonomies?per_page=-1&context=edit',
			'/wp/v2/themes?status=active',
			sprintf( '/wp/v2/%s/%s?context=edit', $rest_base, $post->ID ),
			sprintf( '/wp/v2/types/%s?context=edit', $post_type ),
			sprintf( '/wp/v2/users/me?post_type=%s&context=edit', $post_type ),
			[ '/wp/v2/media', 'OPTIONS' ],
			[ '/wp/v2/blocks', 'OPTIONS' ],
			sprintf( '/wp/v2/%s/%d/autosaves?context=edit', $rest_base, $post->ID ),
		];

		/**
		 * Preload common data by specifying an array of REST API paths that will be preloaded.
		 *
		 * Filters the array of paths that will be preloaded.
		 *
		 * @since 5.0.0
		 *
		 * @param string[] $preload_paths Array of paths to preload.
		 * @param WP_Post  $post          Post being edited.
		 */
		$preload_paths = apply_filters( 'block_editor_preload_paths', $preload_paths, $post );

		/*
		 * Ensure the global $post remains the same after API data is preloaded.
		 * Because API preloading can call the_content and other filters, plugins
		 * can unexpectedly modify $post.
		 */
		$backup_global_post = $post;

		$preload_data = array_reduce(
			$preload_paths,
			'rest_preload_api_request',
			[]
		);

		// Restore the global $post as it was before API preloading.
		$post = $backup_global_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		wp_default_packages_inline_scripts( wp_scripts() );
		wp_add_inline_script(
			'wp-api-fetch',
			sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
			'after'
		);

		$script_slug   = 'genesis-custom-blocks-edit-block-script';
		$script_handle = require $this->plugin->get_path( 'js/dist/edit-block.asset.php' );
		wp_enqueue_script(
			$script_slug,
			$this->plugin->get_url( 'js/dist/edit-block.js' ),
			array_merge( $script_handle['dependencies'], [ 'wp-api-fetch' ] ),
			$script_handle['version'],
			true
		);

		wp_localize_script(
			$script_slug,
			'gcbEditor',
			[
				'postType'     => get_post_type(),
				'postId'       => isset( $post->ID ) ? $post->ID : null,
				'settings'     => [],
				'initialEdits' => $this->get_initial_edits(),
			]
		);
	}

	/**
	 * Gets the initial edits, forked from Core.
	 *
	 * @return array|null The initial edits.
	 */
	public function get_initial_edits() {
		$post = get_post();
		if ( ! $post ) {
			return null;
		}

		if ( 'auto-draft' === $post->post_status ) {
			// Override "(Auto Draft)" new post default title with empty string, or filtered value.
			return [
				'title'   => $post->post_title,
				'content' => $post->post_content,
				'excerpt' => $post->post_excerpt,
			];
		}

		return null;
	}
}
