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
		add_filter( 'rest_pre_dispatch', [ $this, 'modify_render_request' ], 0, 3 );
		add_filter( 'render_block_data', [ $this, 'modify_render_block_data_defaults' ] );
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

	/**
	 * Modifies the block-renderer request as additional post params are not allowed
	 *
	 * @param mixed           $result Response to replace the requested version with. Can be anything a normal endpoint can return, or null to not hijack the request.
	 * @param WP_REST_Server  $server Server instance.
	 * @param WP_REST_Request $request Request used to generate the response.
	 */
	public function modify_render_request( $result, $server, $request ) {
		if ( 'POST' !== $request->get_method()
			|| ! str_starts_with( $request->get_route(), '/wp/v2/block-renderer/genesis-custom-blocks' ) ) {

			return $result;
		}

		global $inner_block_request;
		$json                = json_decode( $request->get_body(), true );
		$inner_block_request = $json['attributes']['inner_blocks'];
		$attributes          = [ 'attributes' => $json['attributes']['attributes'] ];
		$request->set_body( wp_json_encode( $attributes ) );
	}

	/**
	 * Includes the inner blocks in the render response from the block_renderer
	 *
	 * @param array $parsed_block The parsed block.
	 */
	public function modify_render_block_data_defaults( $parsed_block ) {
		global $inner_block_request;
		// the innerBlocks param should only be set within ajax preview requests.
		if ( empty( $inner_block_request ) ) {
			return $parsed_block;
		}

		$block_name = $parsed_block['blockName'];
		$attributes = $parsed_block['attrs'];

		$complete_block = '<!-- wp:' . $block_name;
		if ( is_array( $attributes ) && ! empty( $attributes ) ) {
			$complete_block .= ' ' . wp_json_encode( $attributes );
		}
		$complete_block .= ' -->';
		$complete_block .= $inner_block_request . '<!-- /wp:' . $block_name . ' -->';

		return parse_blocks( $complete_block )[0];
	}
}
