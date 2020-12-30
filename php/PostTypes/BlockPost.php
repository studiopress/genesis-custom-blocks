<?php
/**
 * Block Post Type.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\PostTypes;

use Genesis\CustomBlocks\ComponentAbstract;
use Genesis\CustomBlocks\Blocks\Block;
use Genesis\CustomBlocks\Blocks\Field;
use Genesis\CustomBlocks\Blocks\Controls\ControlAbstract;

/**
 * Class Block
 */
class BlockPost extends ComponentAbstract {

	/**
	 * Slug used for the custom post type.
	 *
	 * @var string
	 */
	private $slug;

	/**
	 * Registered controls.
	 *
	 * @var ControlAbstract[]
	 */
	public $controls = [];

	/**
	 * Block Post constructor.
	 */
	public function __construct() {
		$this->slug = genesis_custom_blocks()->get_post_type_slug();
	}

	/**
	 * Register any hooks that this component needs.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'init', [ $this, 'register_post_type' ] );
		add_action( 'plugins_loaded', [ $this, 'add_caps' ] );
		add_action( 'edit_form_before_permalink', [ $this, 'template_location' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'init', [ $this, 'register_controls' ] );
		add_filter( 'genesis_custom_blocks_field_value', [ $this, 'get_field_value' ], 10, 3 );

		// Clean up the list table.
		add_filter( 'disable_months_dropdown', '__return_true', 10, $this->slug );
		add_filter( 'page_row_actions', [ $this, 'page_row_actions' ] );
		add_filter( 'bulk_actions-edit-' . $this->slug, [ $this, 'bulk_actions' ] );
		add_filter( 'manage_edit-' . $this->slug . '_columns', [ $this, 'list_table_columns' ] );
		add_action( 'manage_' . $this->slug . '_posts_custom_column', [ $this, 'list_table_content' ], 10, 2 );
	}

	/**
	 * Register the controls.
	 *
	 * @return void
	 */
	public function register_controls() {
		$control_names = [
			'text',
			'textarea',
			'url',
			'email',
			'number',
			'color',
			'image',
			'select',
			'multiselect',
			'toggle',
			'range',
			'checkbox',
			'radio',
		];

		$controls = [];
		foreach ( $control_names as $control_name ) {
			$control = $this->get_control( $control_name );
			if ( $control ) {
				$controls[ $control->name ] = $control;
			}
		}

		/**
		 * Filters the available controls.
		 *
		 * @param array $controls {
		 *     An associative array of the available controls.
		 *
		 *     @type string $control_name The name of the control, like 'user'.
		 *     @type object $control      The control object, extending ControlAbstract.
		 * }
		 */
		$this->controls = apply_filters( 'genesis_custom_blocks_controls', $controls );
	}

	/**
	 * Gets an instantiated control.
	 *
	 * @param string $control_name The name of the control.
	 * @return object|null The instantiated control, or null.
	 */
	public function get_control( $control_name ) {
		if ( isset( $this->controls[ $control_name ] ) ) {
			return $this->controls[ $control_name ];
		}

		$separator     = '_';
		$class_name    = str_replace( $separator, '', ucwords( $control_name, $separator ) );
		$control_class = 'Genesis\\CustomBlocks\\Blocks\\Controls\\' . $class_name;
		if ( class_exists( $control_class ) ) {
			return new $control_class();
		}
	}

	/**
	 * Gets the registered controls.
	 *
	 * @return ControlAbstract[] The block controls.
	 */
	public function get_controls() {
		if ( ! did_action( 'init' ) ) {
			_doing_it_wrong(
				__METHOD__,
				esc_html__( 'Must be called after the init action so the controls are registered', 'genesis-custom-blocks' ),
				'1.0.0'
			);
		}

		return $this->controls;
	}

	/**
	 * Gets the field value to be made available or echoed on the front-end template.
	 *
	 * Gets the value based on the control type.
	 * For example, a 'user' control can return a WP_User, a string, or false.
	 * The $echo parameter is whether the value will be echoed on the front-end template,
	 * or simply made available.
	 *
	 * @param mixed  $value The field value.
	 * @param string $control The type of the control, like 'user'.
	 * @param bool   $echo Whether or not this value will be echoed.
	 * @return mixed $value The filtered field value.
	 */
	public function get_field_value( $value, $control, $echo ) {
		if ( isset( $this->controls[ $control ] ) && method_exists( $this->controls[ $control ], 'validate' ) ) {
			return call_user_func( [ $this->controls[ $control ], 'validate' ], $value, $echo );
		}

		return $value;
	}

	/**
	 * Register the custom post type.
	 *
	 * @return void
	 */
	public function register_post_type() {
		$labels = [
			'name'               => _x( 'Content Blocks', 'post type general name', 'genesis-custom-blocks' ),
			'singular_name'      => _x( 'Content Block', 'post type singular name', 'genesis-custom-blocks' ),
			'menu_name'          => _x( 'Custom Blocks', 'admin menu', 'genesis-custom-blocks' ),
			'name_admin_bar'     => _x( 'Block', 'add new on admin bar', 'genesis-custom-blocks' ),
			'add_new'            => _x( 'Add New', 'block', 'genesis-custom-blocks' ),
			'add_new_item'       => __( 'Add New Block', 'genesis-custom-blocks' ),
			'new_item'           => __( 'New Block', 'genesis-custom-blocks' ),
			'edit_item'          => __( 'Edit Block', 'genesis-custom-blocks' ),
			'view_item'          => __( 'View Block', 'genesis-custom-blocks' ),
			'all_items'          => __( 'All Blocks', 'genesis-custom-blocks' ),
			'search_items'       => __( 'Search Blocks', 'genesis-custom-blocks' ),
			'parent_item_colon'  => __( 'Parent Blocks:', 'genesis-custom-blocks' ),
			'not_found'          => __( 'No blocks found.', 'genesis-custom-blocks' ),
			'not_found_in_trash' => __( 'No blocks found in Trash.', 'genesis-custom-blocks' ),
		];

		$args = [
			'labels'        => $labels,
			'public'        => false,
			'show_ui'       => true,
			'show_in_menu'  => true,
			'show_in_rest'  => current_user_can( 'edit_posts' ),
			'menu_position' => 100,
			'menu_icon'     => 'data:image/svg+xml;base64,' . base64_encode( // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
				file_get_contents( $this->plugin->get_assets_path( 'images/admin-menu-icon.svg' ) ) // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- This SVG icon is being included from the plugin directory, so using file_get_contents is okay.
			),
			'query_var'     => true,
			'rewrite'       => [ 'slug' => $this->slug ],
			'hierarchical'  => true,
			'capabilities'  => $this->get_capabilities(),
			'map_meta_cap'  => true,
			'supports'      => [ 'editor', 'title' ],
		];

		register_post_type( $this->slug, $args );
	}

	/**
	 * Add custom capabilities
	 *
	 * @return void
	 */
	public function add_caps() {
		if ( ! is_admin() ) {
			return;
		}

		$admin = get_role( 'administrator' );
		if ( ! $admin ) {
			return;
		}

		foreach ( $this->get_capabilities() as $capability => $custom_capability ) {
			$admin->add_cap( $custom_capability );
		}
	}

	/**
	 * Gets the mapping of capabilities for the custom post type.
	 *
	 * @return array An associative array of capability key => custom capability value.
	 */
	public function get_capabilities() {
		return [
			'edit_post'          => "{$this->slug}_edit_block",
			'edit_posts'         => "{$this->slug}_edit_blocks",
			'edit_others_posts'  => "{$this->slug}_edit_others_blocks",
			'publish_posts'      => "{$this->slug}_publish_blocks",
			'read_post'          => "{$this->slug}_read_block",
			'read_private_posts' => "{$this->slug}_read_private_blocks",
			'delete_post'        => "{$this->slug}_delete_block",
		];
	}

	/**
	 * Enqueue scripts and styles used by the Block post type.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$screen = get_current_screen();

		if ( ! is_object( $screen ) ) {
			return;
		}

		if ( $this->slug === $screen->post_type && 'edit' === $screen->base ) {
			wp_enqueue_style(
				'genesis-custom-blocks-edit-block',
				$this->plugin->get_url( 'css/admin.edit-block.css' ),
				[],
				$this->plugin->get_version()
			);
		}
	}

	/**
	 * Display the template location below the title.
	 */
	public function template_location() {
		$post   = get_post();
		$screen = get_current_screen();

		if ( ! is_object( $screen ) || $this->slug !== $screen->post_type ) {
			return;
		}

		if ( ! isset( $post->post_name ) || empty( $post->post_name ) ) {
			return;
		}

		$locations = genesis_custom_blocks()->get_template_locations( $post->post_name, 'block' );
		$template  = genesis_custom_blocks()->locate_template( $locations, '', true );

		if ( ! $template ) {
			return;
		}

		// Formatting to make the template paths easier to understand.
		$template_short  = str_replace( WP_CONTENT_DIR, basename( WP_CONTENT_DIR ), $template );
		$template_parts  = explode( '/', $template_short );
		$filename        = array_pop( $template_parts );
		$template_breaks = '/' . trailingslashit( implode( '/', $template_parts ) );

		if ( $template ) {
			?>
			<div id="edit-slug-box">
				<strong><?php esc_html_e( 'Template:', 'genesis-custom-blocks' ); ?></strong>
				<?php echo esc_html( $template_breaks ); ?><strong><?php echo esc_html( $filename ); ?></strong>
			</div>
			<?php
		}
	}

	/**
	 * Change the columns in the Custom Blocks list table
	 *
	 * @param array $columns An array of column name ⇒ label. The name is passed to functions to identify the column.
	 *
	 * @return array
	 */
	public function list_table_columns( $columns ) {
		$new_columns = [
			'cb'       => $columns['cb'],
			'title'    => $columns['title'],
			'template' => __( 'Template', 'genesis-custom-blocks' ),
			'category' => __( 'Category', 'genesis-custom-blocks' ),
			'keywords' => __( 'Keywords', 'genesis-custom-blocks' ),
		];
		return $new_columns;
	}

	/**
	 * Output custom column data into the table
	 *
	 * @param string $column  The name of the column to display.
	 * @param int    $post_id The ID of the current post.
	 *
	 * @return void
	 */
	public function list_table_content( $column, $post_id ) {
		if ( 'template' === $column ) {
			$block     = new Block( $post_id );
			$locations = genesis_custom_blocks()->get_template_locations( $block->name, 'block' );
			$template  = genesis_custom_blocks()->locate_template( $locations, '', true );

			if ( ! $template ) {
				esc_html_e( 'No template found.', 'genesis-custom-blocks' );
			} else {
				// Formatting to make the template path easier to understand.
				$template_short  = str_replace( WP_CONTENT_DIR . '/themes/', '', $template );
				$template_parts  = explode( '/', $template_short );
				$template_breaks = implode( '/', $template_parts );
				echo wp_kses(
					'<code>' . $template_breaks . '</code>',
					[
						'code' => [],
						'wbr'  => [],
					]
				);
			}
		}
		if ( 'keywords' === $column ) {
			$block = new Block( $post_id );
			echo esc_html( implode( ', ', $block->keywords ) );
		}
		if ( 'category' === $column ) {
			$block = new Block( $post_id );
			echo esc_html( $block->category['title'] );
		}
	}

	/**
	 * Hide the Quick Edit row action.
	 *
	 * @param array $actions An array of row action links.
	 *
	 * @return array
	 */
	public function page_row_actions( $actions = [] ) {
		$post = get_post();

		// Abort if the post type is incorrect.
		if ( $this->slug !== $post->post_type ) {
			return $actions;
		}

		// Remove the Quick Edit link.
		if ( isset( $actions['inline hide-if-no-js'] ) ) {
			unset( $actions['inline hide-if-no-js'] );
		}

		// Return the set of links without Quick Edit.
		return $actions;
	}

	/**
	 * Remove Edit from the Bulk Actions menu
	 *
	 * @param array $actions An array of bulk actions.
	 *
	 * @return array
	 */
	public function bulk_actions( $actions ) {
		unset( $actions['edit'] );

		return $actions;
	}
}
