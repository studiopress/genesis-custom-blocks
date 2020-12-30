<?php
/**
 * The 'Edit Block' submenu page.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use WP_Error;
use WP_Post;
use Genesis\CustomBlocks\Blocks\Block;
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
	 * The REST API capability type.
	 *
	 * @var string
	 */
	const CABAPILITY = 'edit_posts';

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_filter( 'replace_editor', [ $this, 'should_replace_editor' ], 10, 2 );
		add_filter( 'use_block_editor_for_post_type', [ $this, 'should_use_block_editor_for_post_type' ], 10, 2 );
		add_action( 'admin_footer', [ $this, 'enqueue_assets' ] );
		add_action( 'rest_api_init', [ $this, 'register_route_template_file' ] );
		add_action( 'rest_api_init', [ $this, 'register_route_block_categories' ] );
	}

	/**
	 * Gets whether this should replace the native editor.
	 *
	 * Forked from the Web Stories For WordPress plugin.
	 * https://github.com/google/web-stories-wp/blob/a3648a06b57c1af90cd73a75d0b8448a9e5a3d2b/includes/Story_Post_Type.php#L399
	 * Since the 'replace_editor' filter can be run multiple times, only run
	 * some admin-header.php logic after the 'current_screen' action.
	 *
	 * @param bool    $replace Whether to replace the editor.
	 * @param WP_Post $post    The current post.
	 * @return bool Whether this should replace the editor.
	 */
	public function should_replace_editor( $replace, $post ) {
		if ( genesis_custom_blocks()->get_post_type_slug() === get_post_type( $post ) ) {
			if ( did_action( 'current_screen' ) ) {
				require_once genesis_custom_blocks()->get_path() . 'php/Views/EditorHeader.php';
			}

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

		$post_id = get_the_ID();
		$block   = new Block( $post_id );
		wp_add_inline_script(
			self::SCRIPT_SLUG,
			sprintf(
				'const gcbEditor = %s;',
				wp_json_encode(
					[
						'controls'         => genesis_custom_blocks()->block_post->get_controls(),
						'postType'         => get_post_type(),
						'postId'           => $post_id,
						'settings'         => [
							'titlePlaceholder'   => __( 'Block title', 'genesis-custom-blocks' ),
							'richEditingEnabled' => false,
						],
						'template'         => $this->get_template_file( $block->name ),
						'initialEdits'     => null,
						'isOnboardingPost' => $post_id && intval( get_option( Onboarding::OPTION_NAME ) ) === $post_id,
					]
				)
			),
			'before'
		);

		$edit_block_style_path = 'css/dist/edit-block.css';
		$css_config            = require $this->plugin->get_path( 'css/dist/edit-block.asset.php' );
		wp_enqueue_style(
			self::STYLE_SLUG,
			$this->plugin->get_url( $edit_block_style_path ),
			[ 'wp-components' ],
			$css_config['version']
		);
	}

	/**
	 * Registers a route to get the template file.
	 */
	public function register_route_template_file() {
		register_rest_route(
			genesis_custom_blocks()->get_slug(),
			'template-file',
			[
				'callback'            => [ $this, 'get_template_file_response' ],
				'permission_callback' => function() {
					return current_user_can( self::CABAPILITY );
				},
				'args'                => [
					'blockName' => [
						'description' => __( 'Block name', 'genesis-custom-blocks' ),
						'type'        => 'string',
					],
				],
			]
		);
	}

	/**
	 * Gets the response for the `template-file` endpoint.
	 *
	 * @param array $data Data sent in the GET request.
	 * @return WP_REST_Response|WP_Error Response to the request.
	 */
	public function get_template_file_response( $data ) {
		if ( empty( $data['blockName'] ) ) {
			return new WP_Error(
				'no_block_name',
				__( 'Please pass a block name', 'genesis-custom-blocks' )
			);
		}

		return rest_ensure_response( $this->get_template_file( $data['blockName'] ) );
	}


	/**
	 * Gets the template path and whether it exists.
	 *
	 * @param string $block_name The block name (slug).
	 * @return array Template file data.
	 */
	public function get_template_file( $block_name ) {
		$locations     = genesis_custom_blocks()->get_template_locations( $block_name, 'block' );
		$template_path = genesis_custom_blocks()->locate_template( $locations );

		$template_exists = ! empty( $template_path );
		if ( ! $template_exists ) {
			$template_path = get_stylesheet_directory() . "/blocks/block-{$block_name}.php";
		}

		return [
			'templateExists' => $template_exists,
			'templatePath'   => str_replace(
				WP_CONTENT_DIR,
				basename( WP_CONTENT_DIR ),
				$template_path
			),
		];
	}

	/**
	 * Registers a route to get all of the categories for all registered blocks.
	 */
	public function register_route_block_categories() {
		register_rest_route(
			genesis_custom_blocks()->get_slug(),
			'block-categories',
			[
				'callback'            => [ $this, 'get_block_categories_response' ],
				'permission_callback' => function() {
					return current_user_can( self::CABAPILITY );
				},
			]
		);
	}

	/**
	 * Gets all block categories.
	 *
	 * Needed because getCategories() from @wordpress/blocks gets the categories
	 * from blocks registered via JS.
	 * But in the GCB editor, no block is registered.
	 *
	 * @return array[] The block categories for all registered blocks, not just GCB blocks.
	 */
	public function get_block_categories_response() {
		include_once ABSPATH . 'wp-admin/includes/post.php';
		return get_block_categories( get_post() );
	}
}
