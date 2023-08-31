<?php
/**
 * The 'Edit Block' submenu page.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
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
		add_filter( 'admin_footer_text', [ $this, 'conditionally_prevent_footer_text' ] );
		add_filter( 'update_footer', [ $this, 'conditionally_prevent_update_text' ], 11 );
		add_action( 'rest_api_init', [ $this, 'register_route_template_file' ] );
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
		if ( ! $this->is_gcb_editor() ) {
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
						'categories'       => get_block_categories( get_post() ),
					]
				)
			),
			'before'
		);

		$edit_block_style_path   = 'css/dist/edit-block.css';
		$edit_block_style_config = require $this->plugin->get_path( 'css/dist/edit-block.asset.php' );
		wp_enqueue_style(
			self::STYLE_SLUG,
			$this->plugin->get_url( $edit_block_style_path ),
			[ 'wp-components' ],
			$edit_block_style_config['version']
		);

		$editor_style_config = require $this->plugin->get_path( 'css/dist/blocks.editor.asset.php' );
		wp_enqueue_style(
			'genesis-custom-blocks-editor-css',
			$this->plugin->get_url( 'css/dist/blocks.editor.css' ),
			$editor_style_config['dependencies'],
			$editor_style_config['version']
		);
	}

	/**
	 * Gets whether the current screen is the GCB editor.
	 *
	 * @return bool Whether this is the GCB editor.
	 */
	public function is_gcb_editor() {
		$screen = get_current_screen();

		return (
			is_object( $screen ) &&
			genesis_custom_blocks()->get_post_type_slug() === $screen->post_type &&
			'post' === $screen->base
		);
	}

	/**
	 * Conditionally prevents footer text, as the GCB editor is React-driven.
	 *
	 * @param string $text The text to display in the footer.
	 * @return string The filtered footer text.
	 */
	public function conditionally_prevent_footer_text( $text ) {
		if ( $this->is_gcb_editor() ) {
			return '';
		}

		return $text;
	}

	/**
	 * Conditionally prevents WP update text, as the GCB editor is React-driven.
	 *
	 * @param string $text The update text.
	 * @return string The filtered update text.
	 */
	public function conditionally_prevent_update_text( $text ) {
		if ( $this->is_gcb_editor() ) {
			return '';
		}

		return $text;
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
				'permission_callback' => function () {
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

		$stylesheet_locations = genesis_custom_blocks()->get_stylesheet_locations( $block_name );
		$stylesheet_path      = genesis_custom_blocks()->locate_template( $stylesheet_locations );
		$stylesheet_url       = genesis_custom_blocks()->get_url_from_path( $stylesheet_path );

		return [
			'templateExists' => $template_exists,
			'templatePath'   => str_replace(
				WP_CONTENT_DIR,
				basename( WP_CONTENT_DIR ),
				$template_path
			),
			'cssUrl'         => $stylesheet_url,
		];
	}
}
