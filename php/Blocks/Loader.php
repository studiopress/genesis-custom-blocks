<?php
/**
 * Loader initiates the loading of new blocks.
 *
 * @package Genesis\CustomBlocks
 */

namespace Genesis\CustomBlocks\Blocks;

use WP_REST_Server;
use WP_Query;
use Genesis\CustomBlocks\ComponentAbstract;
use Genesis\CustomBlocks\Admin\Settings;

/**
 * Class Loader
 */
class Loader extends ComponentAbstract {

	/**
	 * The script slug for analytics.
	 *
	 * @var string
	 */
	const ANALYTICS_SCRIPT_SLUG = 'genesis-custom-blocks-analytics#async';

	/**
	 * Asset paths and urls for blocks.
	 *
	 * @var array
	 */
	protected $assets = [];

	/**
	 * An associative array of block config data for the blocks that will be registered.
	 *
	 * The key of each item in the array is the block name.
	 *
	 * @var array
	 */
	protected $blocks = [];

	/**
	 * A data store for sharing data to helper functions.
	 *
	 * @var array
	 */
	protected $data = [];

	/**
	 * The template editor.
	 *
	 * @var TemplateEditor
	 */
	protected $template_editor;

	/**
	 * Load the Loader.
	 *
	 * @return $this
	 */
	public function init() {
		$this->template_editor = new TemplateEditor();
		$this->assets          = [
			'path' => [
				'entry'        => $this->plugin->get_path( 'js/dist/block-editor.js' ),
				'editor_style' => $this->plugin->get_path( 'css/dist/blocks.editor.css' ),
			],
			'url'  => [
				'entry'        => $this->plugin->get_url( 'js/dist/block-editor.js' ),
				'editor_style' => $this->plugin->get_url( 'css/dist/blocks.editor.css' ),
			],
		];

		return $this;
	}

	/**
	 * Register all the hooks.
	 */
	public function register_hooks() {
		add_action( 'enqueue_block_editor_assets', [ $this, 'editor_assets' ] );
		add_action( 'init', [ $this, 'retrieve_blocks' ] );
		add_action( 'init', [ $this, 'dynamic_block_loader' ] );
		add_filter( 'rest_endpoints', [ $this, 'add_rest_method' ] );

		// TODO: once 'Requires at least' is bumped to 5.8, delete these conditionals and just use 'block_categories_all'.
		if ( is_wp_version_compatible( '5.8' ) ) {
			add_filter( 'block_categories_all', [ $this, 'register_categories' ] );
		} else {
			add_filter( 'block_categories', [ $this, 'register_categories' ] );
		}
	}

	/**
	 * Retrieve data from the Loader's data store.
	 *
	 * @param string $key The data key to retrieve.
	 * @return mixed
	 */
	public function get_data( $key ) {
		$data = false;

		if ( isset( $this->data[ $key ] ) ) {
			$data = $this->data[ $key ];
		}

		/**
		 * Filters the data that gets returned.
		 *
		 * @param mixed  $data The data from the Loader's data store.
		 * @param string $key  The key for the data being retrieved.
		 */
		$data = apply_filters( 'genesis_custom_blocks_data', $data, $key );

		/**
		 * Filters the data that gets returned, specifically for a single key.
		 *
		 * @param mixed $data The data from the Loader's data store.
		 */
		return apply_filters( "genesis_custom_blocks_data_{$key}", $data );
	}

	/**
	 * Launch the blocks inside Gutenberg.
	 */
	public function editor_assets() {
		$js_handle  = 'genesis-custom-blocks-blocks';
		$css_handle = 'genesis-custom-blocks-editor-css';

		$js_config  = require $this->plugin->get_path( 'js/dist/block-editor.asset.php' );
		$css_config = require $this->plugin->get_path( 'css/dist/blocks.editor.asset.php' );

		wp_enqueue_script(
			$js_handle,
			$this->assets['url']['entry'],
			$js_config['dependencies'],
			$js_config['version'],
			true
		);

		// Add dynamic Gutenberg blocks.
		wp_add_inline_script(
			$js_handle,
			'const gcbBlocks = ' . wp_json_encode( $this->blocks ),
			'before'
		);

		// Used to conditionally show notices for blocks belonging to an author.
		$author_blocks = get_posts(
			[
				'author'         => get_current_user_id(),
				'post_type'      => 'genesis_custom_block',
				// We could use -1 here, but that could be dangerous. 99 is more than enough.
				'posts_per_page' => 99,
			]
		);

		$author_block_slugs = wp_list_pluck( $author_blocks, 'post_name' );
		wp_localize_script(
			$js_handle,
			'genesisCustomBlocks',
			[
				'authorBlocks' => $author_block_slugs,
				'postType'     => get_post_type(), // To conditionally exclude blocks from certain post types.
			]
		);

		// Enqueue optional editor only styles.
		wp_enqueue_style(
			$css_handle,
			$this->assets['url']['editor_style'],
			$css_config['dependencies'],
			$css_config['version']
		);

		$block_names = wp_list_pluck( $this->blocks, 'name' );

		foreach ( $block_names as $block_name ) {
			$this->enqueue_block_styles( $block_name, [ 'preview', 'block' ] );
		}

		$this->enqueue_global_styles();
	}

	/**
	 * Loads dynamic blocks via render_callback for each block.
	 */
	public function dynamic_block_loader() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		foreach ( $this->blocks as $block_name => $block_config ) {
			$block = new Block();
			$block->from_array( $block_config );
			$this->register_block( $block_name, $block );
		}
	}

	/**
	 * Registers a block.
	 *
	 * @param string $block_name The name of the block, including namespace.
	 * @param Block  $block      The block to register.
	 */
	protected function register_block( $block_name, $block ) {
		$attributes = $this->get_block_attributes( $block );

		// sanitize_title() allows underscores, but register_block_type doesn't.
		$block_name = str_replace( '_', '-', $block_name );

		// register_block_type doesn't allow slugs starting with a number.
		if ( isset( $block_name[0] ) && is_numeric( $block_name[0] ) ) {
			$block_name = 'block-' . $block_name;
		}

		register_block_type(
			$block_name,
			[
				'attributes'      => $attributes,
				// @see https://github.com/WordPress/gutenberg/issues/4671
				'render_callback' => function ( $attributes, $content ) use ( $block ) {
					return $this->render_block_template( $block, $attributes, $content );
				},
			]
		);
	}

	/**
	 * Register custom block categories.
	 *
	 * @param array $categories Array of block categories.
	 *
	 * @return array
	 */
	public function register_categories( $categories ) {
		foreach ( $this->blocks as $block_config ) {
			if ( ! isset( $block_config['category'] ) ) {
				continue;
			}

			/*
			 * This is a backwards compatibility fix.
			 *
			 * Block categories used to be saved as strings, but were always included in
			 * the default list of categories, so it's safe to skip them.
			 */
			if ( ! is_array( $block_config['category'] ) || empty( $block_config['category'] ) ) {
				continue;
			}

			if ( ! in_array( $block_config['category'], $categories, true ) ) {
				$categories[] = $block_config['category'];
			}
		}

		return $categories;
	}

	/**
	 * Gets block attributes.
	 *
	 * @param Block $block The block to get attributes from.
	 *
	 * @return array
	 */
	protected function get_block_attributes( $block ) {
		$attributes = [];

		// Default Editor attributes (applied to all blocks).
		$attributes['className'] = [ 'type' => 'string' ];

		foreach ( $block->fields as $field_name => $field ) {
			$attributes = $this->get_attributes_from_field( $attributes, $field_name, $field );
		}

		/**
		 * Filters a given block's attributes.
		 *
		 * These are later passed to register_block_type() in $args['attributes'].
		 * Removing attributes here can cause 'Error loading block...' in the editor.
		 *
		 * @param array[] $attributes The attributes for a block.
		 * @param array   $block      Block data, including its name at $block['name'].
		 */
		return apply_filters( 'genesis_custom_blocks_get_block_attributes', $attributes, $block );
	}

	/**
	 * Sets the field values in the attributes, enabling them to appear in the block.
	 *
	 * @param array  $attributes The attributes in which to store the field value.
	 * @param string $field_name The name of the field, like 'home-hero'.
	 * @param Field  $field      The Field to set the attributes from.
	 * @return array $attributes The attributes, with the new field value set.
	 */
	protected function get_attributes_from_field( $attributes, $field_name, $field ) {
		$attributes[ $field_name ] = [
			'type' => $field->type,
		];

		if ( ! empty( $field->settings['default'] ) ) {
			$attributes[ $field_name ]['default'] = $field->settings['default'];
		}

		if ( 'array' === $field->type ) {
			/**
			 * This is a workaround to allow empty array values. We unset the default value before registering the
			 * block so that the default isn't used to auto-correct empty arrays. This allows the default to be
			 * used only when creating the form.
			 */
			unset( $attributes[ $field_name ]['default'] );
			$items_type                         = 'repeater' === $field->control ? 'object' : 'string';
			$attributes[ $field_name ]['items'] = [ 'type' => $items_type ];
		}

		return $attributes;
	}

	/**
	 * Renders the block provided a template is provided.
	 *
	 * @param Block  $block The block to render.
	 * @param array  $attributes Attributes to render.
	 * @param string $content The block InnerContent, if any.
	 * @return mixed
	 */
	protected function render_block_template( $block, $attributes, $content ) {
		$type = 'block';

		// This is hacky, but the editor doesn't send the original request along.
		if ( 'edit' === filter_input( INPUT_GET, 'context' ) ) {
			$type = [ 'preview', 'block' ];
		}

		if ( ! is_admin() ) {
			// The block has been added, but its values weren't saved (not even the defaults).
			// This is unique to frontend output, as the editor fetches its attributes from the form fields themselves.
			$missing_schema_attributes = array_diff_key( $block->fields, $attributes );
			foreach ( $missing_schema_attributes as $attribute_name => $schema ) {
				if ( isset( $schema->settings['default'] ) ) {
					$attributes[ $attribute_name ] = $schema->settings['default'];
				}
			}

			$did_enqueue_styles = $this->enqueue_block_styles( $block->name, 'block' );

			// The wp_enqueue_style function handles duplicates, so we don't need to worry about multiple blocks
			// loading the global styles more than once.
			$this->enqueue_global_styles();
		}

		/**
		 * The block attributes to be sent to the template.
		 *
		 * @param array   $attributes The block attributes.
		 * @param Field[] $fields     The block fields.
		 */
		$this->data['attributes'] = apply_filters( 'genesis_custom_blocks_template_attributes', $attributes, $block->fields );
		$this->data['config']     = $block;
		$this->data['content']    = $content;

		if ( ! is_admin() && ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) && ! wp_doing_ajax() ) {

			/**
			 * Runs in the 'render_callback' of the block, and only on the front-end, not in the editor.
			 *
			 * The block's name (slug) is in $block->name.
			 * If a block depends on a JavaScript file,
			 * this action is a good place to call wp_enqueue_script().
			 * In that case, pass true as the 5th argument ($in_footer) to wp_enqueue_script().
			 *
			 * @param Block $block The block that is rendered.
			 * @param array $attributes The block attributes.
			 */
			do_action( 'genesis_custom_blocks_render_template', $block, $attributes );

			/**
			 * Runs in a block's 'render_callback', and only on the front-end.
			 *
			 * Same as the action above, but with a dynamic action name that has the block name.
			 *
			 * @param Block $block The block that is rendered.
			 * @param array $attributes The block attributes.
			 */
			do_action( "genesis_custom_blocks_render_template_{$block->name}", $block, $attributes );
		}

		ob_start();
		$this->block_template( $block->name, $type );

		if ( empty( $did_enqueue_styles ) ) {
			$this->template_editor->render_css(
				isset( $this->blocks[ "genesis-custom-blocks/{$block->name}" ]['templateCss'] )
					? $this->blocks[ "genesis-custom-blocks/{$block->name}" ]['templateCss']
					: '',
				$block->name
			);
		}

		return ob_get_clean();
	}

	/**
	 * Enqueues styles for the block.
	 *
	 * @param string       $name The name of the block (slug as defined in UI).
	 * @param string|array $type The type of template to load.
	 * @return bool Whether this found styles and enqueued them.
	 */
	protected function enqueue_block_styles( $name, $type = 'block' ) {
		$locations = [];
		$types     = (array) $type;

		foreach ( $types as $type ) {
			$locations = array_merge(
				$locations,
				genesis_custom_blocks()->get_stylesheet_locations( $name, $type )
			);
		}

		$stylesheet_path = genesis_custom_blocks()->locate_template( $locations );
		$stylesheet_url  = genesis_custom_blocks()->get_url_from_path( $stylesheet_path );

		if ( ! empty( $stylesheet_url ) ) {
			wp_enqueue_style(
				"genesis-custom-blocks__block-{$name}",
				$stylesheet_url,
				[],
				wp_get_theme()->get( 'Version' )
			);

			return true;
		}

		return false;
	}

	/**
	 * Enqueues global block styles.
	 */
	protected function enqueue_global_styles() {
		$locations = [
			'blocks/css/blocks.css',
			'blocks/blocks.css',
		];

		$stylesheet_path = genesis_custom_blocks()->locate_template( $locations );
		$stylesheet_url  = genesis_custom_blocks()->get_url_from_path( $stylesheet_path );

		/**
		 * Enqueue the stylesheet, if it exists.
		 */
		if ( ! empty( $stylesheet_url ) ) {
			wp_enqueue_style(
				'genesis-custom-blocks__global-styles',
				$stylesheet_url,
				[],
				filemtime( $stylesheet_path )
			);
		}
	}

	/**
	 * Loads a block template to render the block.
	 *
	 * @param string       $name The name of the block (slug as defined in UI).
	 * @param string|array $type The type of template to load.
	 */
	protected function block_template( $name, $type = 'block' ) {
		// Loading async it might not come from a query, this breaks load_template().
		global $wp_query;

		// So lets fix it.
		if ( empty( $wp_query ) ) {
			$wp_query = new WP_Query(); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}

		$types   = (array) $type;
		$located = '';

		foreach ( $types as $type ) {
			$templates = genesis_custom_blocks()->get_template_locations( $name, $type );
			$located   = genesis_custom_blocks()->locate_template( $templates );

			if ( ! empty( $located ) ) {
				break;
			}
		}

		if ( ! empty( $located ) ) {
			/**
			 * Allows overriding the theme template.
			 *
			 * @param string $located The located template.
			 */
			$theme_template = apply_filters( 'genesis_custom_blocks_override_theme_template', $located );

			// This is not a load once template, so require_once is false.
			load_template( $theme_template, false );
			return;
		}

		if ( ! empty( $this->blocks[ "genesis-custom-blocks/{$name}" ]['templateMarkup'] ) ) {
			$this->template_editor->render_markup( $this->blocks[ "genesis-custom-blocks/{$name}" ]['templateMarkup'] );
			return;
		}

		if ( ! current_user_can( 'edit_posts' ) || ! isset( $templates[0] ) ) {
			return;
		}

		// Only show the template not found notice on the frontend if WP_DEBUG is enabled.
		if ( is_admin() || ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ) {
			printf(
				'<div class="notice notice-warning">%s</div>',
				wp_kses_post(
					/* translators: %1$s: file path */
					sprintf( __( 'No Template Editor markup or template file was found: %1$s', 'genesis-custom-blocks' ), '<code>' . esc_html( $templates[0] ) . '</code>' )
				)
			);
		}
	}

	/**
	 * Load all the published blocks and blocks/block.json files.
	 */
	public function retrieve_blocks() {
		// Reverse to preserve order of preference when using array_merge.
		$blocks_files = array_reverse( genesis_custom_blocks()->locate_template( 'blocks/blocks.json', '', false ) );
		foreach ( $blocks_files as $blocks_file ) {
			// This is expected to be on the local filesystem, so file_get_contents() is ok to use here.
			$json       = file_get_contents( $blocks_file ); // @codingStandardsIgnoreLine
			$block_data = json_decode( $json, true );

			// Merge if no json_decode error occurred.
			if ( json_last_error() == JSON_ERROR_NONE ) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual
				$this->blocks = array_merge( $this->blocks, $block_data );
			}
		}

		$is_edit_context = 'edit' === filter_input( INPUT_GET, 'context' );
		$block_posts     = new WP_Query(
			[
				'post_type'      => genesis_custom_blocks()->get_post_type_slug(),
				'post_status'    => $is_edit_context ? 'any' : 'publish',
				'posts_per_page' => 100,
			]
		);

		if ( $block_posts->post_count > 0 ) {
			foreach ( $block_posts->posts as $post ) {
				$block_data = json_decode( $post->post_content, true );

				if ( json_last_error() == JSON_ERROR_NONE ) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual
					$this->blocks = array_merge( $this->blocks, $block_data );
				}
			}
		}

		/**
		 * Use this action to add new blocks and fields with the Genesis\CustomBlocks\add_block and Genesis\CustomBlocks\add_field helper functions.
		 */
		do_action( 'genesis_custom_blocks_add_blocks' );

		/**
		 * Filter the available blocks.
		 *
		 * This is used internally by the Genesis\CustomBlocks\add_block and Genesis\CustomBlocks\add_field helper functions,
		 * but it can also be used to hide certain blocks if desired.
		 *
		 * @param array $blocks An associative array of blocks.
		 */
		$this->blocks = apply_filters( 'genesis_custom_blocks_available_blocks', $this->blocks );
	}

	/**
	 * Add a new block.
	 *
	 * This method should be called during the genesis_custom_blocks_add_blocks action, to ensure
	 * that the block isn't added too late.
	 *
	 * @param array $block_config The config of the block to add.
	 */
	public function add_block( $block_config ) {
		if ( ! isset( $block_config['name'] ) ) {
			return;
		}

		$this->blocks[ "genesis-custom-blocks/{$block_config['name']}" ] = $block_config;
	}

	/**
	 * Add a new field to an existing block.
	 *
	 * This method should be called during the genesis_custom_blocks_add_blocks action, to ensure
	 * that the block isn't added too late.
	 *
	 * @param string $block_name   The name of the block that the field is added to.
	 * @param array  $field_config The config of the field to add.
	 */
	public function add_field( $block_name, $field_config ) {
		if ( ! isset( $this->blocks[ "genesis-custom-blocks/{$block_name}" ] ) ) {
			return;
		}
		if ( ! isset( $field_config['name'] ) ) {
			return;
		}

		$this->blocks[ "genesis-custom-blocks/{$block_name}" ]['fields'][ $field_config['name'] ] = $field_config;
	}

	/**
	 * Adds 'POST' to the allowed REST methods for GCB blocks.
	 *
	 * The <ServerSideRender> uses the httpMethod of 'POST' to handle a larger attributes object.
	 * That is already added in WP 5.6+, so no need to add it there.
	 *
	 * @todo: Delete when this plugin's 'Requires at least' is bumped to 5.6.
	 * @see https://core.trac.wordpress.org/ticket/49680#comment:15
	 *
	 * @param array $endpoints The REST API endpoints, an associative array of $route => $handlers.
	 * @return array The filtered endpoints, with the GCB endpoints allowing POST requests.
	 */
	public function add_rest_method( $endpoints ) {
		if ( is_wp_version_compatible( '5.5' ) ) {
			return $endpoints;
		}

		foreach ( $endpoints as $route => $handler ) {
			if ( 0 === strpos( $route, '/wp/v2/block-renderer/(?P<name>genesis-custom-blocks/' ) && isset( $endpoints[ $route ][0] ) ) {
				$endpoints[ $route ][0]['methods'] = [ WP_REST_Server::READABLE, WP_REST_Server::CREATABLE ];
			}
		}

		return $endpoints;
	}
}
