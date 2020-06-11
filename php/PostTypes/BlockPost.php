<?php
/**
 * Block Post Type.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\PostTypes;

use Genesis\CustomBlocks\ComponentAbstract;
use Genesis\CustomBlocks\Blocks\Block;
use Genesis\CustomBlocks\Blocks\Field;
use Genesis\CustomBlocks\Blocks\Controls;

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
	 * @var Controls\ControlAbstract[]
	 */
	public $controls = [];

	/**
	 * The pro controls.
	 *
	 * @var array
	 */
	public $pro_controls = [
		'repeater',
		'post',
		'rich_text',
		'classic_text',
		'taxonomy',
		'user',
	];

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
		add_action( 'admin_init', [ $this, 'add_caps' ] );
		add_action( 'admin_init', [ $this, 'row_export' ] );
		add_action( 'add_meta_boxes', [ $this, 'add_meta_boxes' ] );
		add_action( 'add_meta_boxes', [ $this, 'remove_meta_boxes' ] );
		add_action( 'edit_form_before_permalink', [ $this, 'template_location' ] );
		add_action( 'post_submitbox_start', [ $this, 'save_draft_button' ] );
		add_filter( 'enter_title_here', [ $this, 'post_title_placeholder' ] );
		add_action( 'post_submitbox_misc_actions', [ $this, 'post_type_condition' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'wp_insert_post_data', [ $this, 'save_block' ], 10, 2 );
		add_action( 'init', [ $this, 'register_controls' ] );
		add_filter( 'genesis_custom_blocks_field_value', [ $this, 'get_field_value' ], 10, 3 );
		add_filter( 'genesis_custom_blocks_sub_field_value', [ $this, 'get_field_value' ], 10, 3 );

		// Clean up the list table.
		add_filter( 'disable_months_dropdown', '__return_true', 10, $this->slug );
		add_filter( 'page_row_actions', [ $this, 'page_row_actions' ], 10, 1 );
		add_filter( 'bulk_actions-edit-' . $this->slug, [ $this, 'bulk_actions' ] );
		add_filter( 'handle_bulk_actions-edit-' . $this->slug, [ $this, 'bulk_export' ], 10, 3 );
		add_filter( 'manage_edit-' . $this->slug . '_columns', [ $this, 'list_table_columns' ] );
		add_action( 'manage_' . $this->slug . '_posts_custom_column', [ $this, 'list_table_content' ], 10, 2 );

		// AJAX Handlers.
		add_action( 'wp_ajax_fetch_field_settings', [ $this, 'ajax_field_settings' ] );
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

		if ( genesis_custom_blocks()->is_pro() ) {
			$control_names = array_merge( $control_names, $this->pro_controls );
		}

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
		 *     @type object $control The control object, extending Controls\ControlAbstract.
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
		} elseif ( in_array( $control, $this->pro_controls, true ) && ! genesis_custom_blocks()->is_pro() ) {
			$pro_control = $this->get_control( $control );
			if ( method_exists( $pro_control, 'validate' ) ) {
				return call_user_func( [ $pro_control, 'validate' ], $value, $echo );
			}
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
			'menu_position' => 100,
			'menu_icon'     => 'data:image/svg+xml;base64,' . base64_encode( // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
				file_get_contents( $this->plugin->get_assets_path( 'images/admin-menu-icon.svg' ) ) // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- This SVG icon is being included from the plugin directory, so using file_get_contents is okay.
			),
			'query_var'     => true,
			'rewrite'       => [ 'slug' => $this->slug ],
			'hierarchical'  => true,
			'capabilities'  => $this->get_capabilities(),
			'map_meta_cap'  => true,
			'supports'      => [ 'title' ],
		];

		register_post_type( $this->slug, $args );
	}

	/**
	 * Add custom capabilities
	 *
	 * @return void
	 */
	public function add_caps() {
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
		$post   = get_post();
		$screen = get_current_screen();

		if ( ! is_object( $screen ) ) {
			return;
		}

		// Enqueue scripts and styles on the edit screen of the Block post type.
		if ( $this->slug === $screen->post_type && 'post' === $screen->base ) {
			wp_enqueue_style(
				'block-post',
				$this->plugin->get_url( 'css/admin.block-post.css' ),
				[],
				$this->plugin->get_version()
			);

			if ( ! in_array( $post->post_status, [ 'publish', 'future', 'pending' ], true ) ) {
				wp_add_inline_style( 'block-post', '#delete-action { display: none; }' );
			}

			wp_enqueue_script(
				'block-post',
				$this->plugin->get_url( 'js/admin.block-post.js' ),
				[ 'jquery', 'jquery-ui-sortable', 'wp-util', 'wp-blocks' ],
				$this->plugin->get_version(),
				false
			);

			wp_localize_script(
				'block-post',
				'blockLab',
				[
					'fieldSettingsNonce' => wp_create_nonce( "{$this->slug}_field_settings_nonce" ),
					'postTypes'          => [
						'all'  => __( 'All', 'genesis-custom-blocks' ),
						'none' => __( 'None', 'genesis-custom-blocks' ),
					],
					'copySuccessMessage' => __( 'Copied to clipboard.', 'genesis-custom-blocks' ),
					'copyFailMessage'    => sprintf(
						// translators: Placeholder is a shortcut key combination.
						__( '%1$s to copy.', 'genesis-custom-blocks' ),
						strpos( getenv( 'HTTP_USER_AGENT' ), 'Mac' ) ? 'Cmd+C' : 'Ctrl+C'
					),
				]
			);
		}

		if ( $this->slug === $screen->post_type && 'edit' === $screen->base ) {
			wp_enqueue_style(
				'block-edit',
				$this->plugin->get_url( 'css/admin.block-edit.css' ),
				[],
				$this->plugin->get_version()
			);
		}
	}

	/**
	 * Add meta boxes.
	 *
	 * @return void
	 */
	public function add_meta_boxes() {
		$post = get_post();

		add_meta_box(
			'block_properties',
			__( 'Block Properties', 'genesis-custom-blocks' ),
			[ $this, 'render_properties_meta_box' ],
			$this->slug,
			'side',
			'default'
		);

		add_meta_box(
			'block_fields',
			__( 'Block Fields', 'genesis-custom-blocks' ),
			[ $this, 'render_fields_meta_box' ],
			$this->slug,
			'normal',
			'default'
		);

		if ( ! empty( $post->post_name ) ) {
			$locations = genesis_custom_blocks()->get_template_locations( $post->post_name );
			$template  = genesis_custom_blocks()->locate_template( $locations, '', true );

			if ( ! $template ) {
				add_meta_box(
					'block_template',
					__( 'Template', 'genesis-custom-blocks' ),
					[ $this, 'render_template_meta_box' ],
					$this->slug,
					'normal',
					'high'
				);
			}
		}
	}

	/**
	 * Removes unneeded meta boxes.
	 *
	 * @return void
	 */
	public function remove_meta_boxes() {
		$screen = get_current_screen();

		if ( ! is_object( $screen ) || $this->slug !== $screen->post_type ) {
			return;
		}

		remove_meta_box( 'slugdiv', $this->slug, 'normal' );
	}

	/**
	 * Adds a "Save Draft" button next to the "Publish" button.
	 *
	 * @return void
	 */
	public function save_draft_button() {
		$post   = get_post();
		$screen = get_current_screen();

		if ( ! is_object( $screen ) || $this->slug !== $screen->post_type ) {
			return;
		}

		if ( ! in_array( $post->post_status, [ 'publish', 'future', 'pending' ], true ) ) {
			?>
			<input type="submit" name="save" value="<?php esc_attr_e( 'Save Draft', 'genesis-custom-blocks' ); ?>" class="button" />
			<?php
		}
	}

	/**
	 * Render the Block Fields meta box.
	 *
	 * @return void
	 */
	public function render_properties_meta_box() {
		$post  = get_post();
		$block = new Block( $post->ID );
		$icons = genesis_custom_blocks()->get_icons();

		if ( ! $block->icon ) {
			$block->icon = 'genesis_custom_blocks';
		}
		?>
		<p>
			<label for="block-properties-slug">
				<?php esc_html_e( 'Slug:', 'genesis-custom-blocks' ); ?>
			</label>
			<input
				name="post_name"
				type="text"
				id="block-properties-slug"
				value="<?php echo esc_attr( $post->post_name ); ?>" />
		</p>
		<p class="description">
			<?php
			esc_html_e(
				'Used to determine the name of the template file.',
				'genesis-custom-blocks'
			);
			?>
		</p>
		<p>
			<label for="block-properties-icon">
				<?php esc_html_e( 'Icon:', 'genesis-custom-blocks' ); ?>
			</label>
			<input
				name="block-properties-icon"
				type="hidden"
				id="block-properties-icon"
				value="<?php echo esc_attr( $block->icon ); ?>" />
			<span id="block-properties-icon-current">
				<?php
				if ( array_key_exists( $block->icon, $icons ) ) {
					echo wp_kses( $icons[ $block->icon ], genesis_custom_blocks()->allowed_svg_tags() );
				}
				?>
			</span>
			<a class="button block-properties-icon-button" id="block-properties-icon-choose" href="#block-properties-icon-choose">
				<?php esc_attr_e( 'Choose', 'genesis-custom-blocks' ); ?>
			</a>
			<a class="button block-properties-icon-button" id="block-properties-icon-close" href="#">
				<?php esc_attr_e( 'Close', 'genesis-custom-blocks' ); ?>
			</a>
			<span class="block-properties-icon-select" id="block-properties-icon-select">
				<?php
				foreach ( $icons as $icon => $svg ) {
					$selected = $icon === $block->icon ? 'selected' : '';
					printf(
						'<span class="icon %1$s" data-value="%2$s">%3$s</span>',
						esc_attr( $selected ),
						esc_attr( $icon ),
						wp_kses( $svg, genesis_custom_blocks()->allowed_svg_tags() )
					);
				}
				?>
			</span>
		</p>
		<p>
			<label for="block-properties-category">
				<?php esc_html_e( 'Category:', 'genesis-custom-blocks' ); ?>
			</label>
			<select name="block-properties-category" id="block-properties-category" class="block-properties-category">
				<?php
				$categories = get_block_categories( $post );
				foreach ( $categories as $category ) {
					?>
					<option value="<?php echo esc_attr( $category['slug'] ); ?>" <?php selected( $category['slug'], $block->category['slug'] ); ?>>
						<?php echo esc_html( $category['title'] ); ?>
					</option>
					<?php
				}
				?>
				<option disabled>────────</option>
				<option value="__custom"><?php esc_html_e( 'Custom Category', 'genesis-custom-blocks' ); ?></option>
			</select>
			<span class="block-properties-category-custom">
				<label for="block-properties-category-name">
					<?php esc_html_e( 'New Category Name:', 'genesis-custom-blocks' ); ?>
				</label>
				<input
					name="block-properties-category-name"
					type="text"
					id="block-properties-category-name"
					value="" />
			</span>
		</p>
		<p>
			<label for="block-properties-keywords">
				<?php esc_html_e( 'Keywords:', 'genesis-custom-blocks' ); ?>
			</label>
			<input
				name="block-properties-keywords"
				type="text"
				id="block-properties-keywords"
				value="<?php echo esc_attr( implode( ', ', $block->keywords ) ); ?>" />
		</p>
		<p class="description">
			<?php
			esc_html_e(
				'A comma separated list of keywords, used when searching. Maximum of 3.',
				'genesis-custom-blocks'
			);
			?>
		</p>
		<?php
		wp_nonce_field( "{$this->slug}_save_properties", "{$this->slug}_properties_nonce" );
	}

	/**
	 * Render the Block Fields meta box.
	 *
	 * @return void
	 */
	public function render_fields_meta_box() {
		$post  = get_post();
		$block = new Block( $post->ID );

		/**
		 * Fires before the block fields meta box.
		 */
		do_action( 'genesis_custom_blocks_before_fields_list' );

		?>
		<div class="block-fields-list">
			<table class="widefat">
				<thead>
					<tr>
						<th class="block-fields-sort"></th>
						<th class="block-fields-label">
							<?php esc_html_e( 'Field Label', 'genesis-custom-blocks' ); ?>
						</th>
						<th class="block-fields-name">
							<?php esc_html_e( 'Field Name', 'genesis-custom-blocks' ); ?>
						</th>
						<th class="block-fields-control">
							<?php esc_html_e( 'Field Type', 'genesis-custom-blocks' ); ?>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td colspan="4">
							<div class="block-fields-rows">
								<p class="block-no-fields">
									<?php echo wp_kses_post( __( 'Click <strong>Add Field</strong> below to add your first field.', 'genesis-custom-blocks' ) ); ?>
								</p>
								<?php
								if ( count( $block->fields ) > 0 ) {
									foreach ( $block->fields as $field ) {
										$this->render_fields_meta_box_row( $field, uniqid() );
									}
								}
								?>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="block-fields-actions-add-field">
			<button type="button" aria-label="Add Field" class="block-fields-action" id="block-add-field">
				<span class="dashicons dashicons-plus"></span>
				<?php esc_attr_e( 'Add Field', 'genesis-custom-blocks' ); ?>
			</button>
			<script type="text/html" id="tmpl-field-repeater">
				<?php
				$args = [
					'name'  => 'new-field',
					'label' => __( 'New Field', 'genesis-custom-blocks' ),
				];
				$this->render_fields_meta_box_row( new Field( $args ) );
				?>
			</script>
			<script type="text/html" id="tmpl-sub-field-rows">
				<?php $this->render_fields_sub_rows(); ?>
			</script>
		</div>
		<?php
		do_action( "{$this->slug}_after_fields_list" );
		wp_nonce_field( "{$this->slug}_save_fields", "{$this->slug}_fields_nonce" );
	}

	/**
	 * Render a single Field as a row.
	 *
	 * @param Field $field      The Field containing the options to render.
	 * @param mixed $uid        A unique ID to used to unify the HTML name, for, and id attributes.
	 * @param mixed $parent_uid The parent's unique ID, if the field has a parent.
	 *
	 * @return void
	 */
	public function render_fields_meta_box_row( $field, $uid = false, $parent_uid = false ) {
		// Use a template placeholder if no UID provided.
		if ( ! $uid ) {
			$uid = '{{ data.uid }}';
		}

		$is_field_disabled = ( ! isset( $this->controls[ $field->control ] ) && in_array( $field->control, $this->pro_controls, true ) );
		?>
		<div class="block-fields-row" data-uid="<?php echo esc_attr( $uid ); ?>">
			<div class="block-fields-row-columns">
				<div class="block-fields-sort">
					<span class="block-fields-sort-handle"></span>
				</div>
				<div class="block-fields-label">
					<a class="row-title" href="javascript:" id="block-fields-label_<?php echo esc_attr( $uid ); ?>">
						<?php echo esc_html( $field->label ); ?>
					</a>
					<div class="block-fields-actions">
						<a class="block-fields-actions-edit" href="javascript:">
							<?php esc_html_e( 'Edit', 'genesis-custom-blocks' ); ?>
						</a>
						&nbsp;|&nbsp;
						<a class="block-fields-actions-duplicate" href="javascript:">
							<?php esc_html_e( 'Duplicate', 'genesis-custom-blocks' ); ?>
						</a>
						&nbsp;|&nbsp;
						<a class="block-fields-actions-delete" href="javascript:">
							<?php esc_html_e( 'Delete', 'genesis-custom-blocks' ); ?>
						</a>
					</div>
				</div>
				<div class="block-fields-name" id="block-fields-name_<?php echo esc_attr( $uid ); ?>">
					<code id="block-fields-name-code_<?php echo esc_attr( $uid ); ?>"><?php echo esc_html( $field->name ); ?></code>
				</div>
				<div class="block-fields-control" id="block-fields-control_<?php echo esc_attr( $uid ); ?>">
					<?php
					if ( ! $is_field_disabled && isset( $this->controls[ $field->control ] ) ) :
						echo esc_html( $this->controls[ $field->control ]->label );
					else :
						?>
						<span class="dashicons dashicons-warning"></span>
						<span class="pro-required">
							<?php
							/* translators: %1$s is the field type, %2$s is the URL for the Pro license */
							printf(
								wp_kses_post( 'This <code>%1$s</code> field requires an active <a href="%2$s">pro license</a>.', 'genesis-custom-blocks' ),
								esc_html( $field->control ),
								esc_url(
									add_query_arg(
										[
											'post_type' => $this->slug,
											'page'      => 'genesis-custom-blocks-pro',
										],
										admin_url( 'edit.php' )
									)
								)
							);
							?>
						</span>
					<?php endif; ?>
				</div>
			</div>
			<div class="block-fields-edit">
				<table class="widefat">
					<tr class="block-fields-edit-label">
						<td class="spacer"></td>
						<th scope="row">
							<label for="block-fields-edit-label-input_<?php echo esc_attr( $uid ); ?>">
								<?php esc_html_e( 'Field Label', 'genesis-custom-blocks' ); ?>
							</label>
							<p class="description">
								<?php
								esc_html_e(
									'A label describing your block\'s custom field.',
									'genesis-custom-blocks'
								);
								?>
							</p>
						</th>
						<td>
							<input
								name="block-fields-label[<?php echo esc_attr( $uid ); ?>]"
								type="text"
								id="block-fields-edit-label-input_<?php echo esc_attr( $uid ); ?>"
								class="regular-text"
								value="<?php echo esc_attr( $field->label ); ?>"
								data-sync="block-fields-label_<?php echo esc_attr( $uid ); ?>"
								<?php echo $is_field_disabled ? 'readonly="readonly"' : ''; ?>
							/>
							<?php if ( $is_field_disabled ) : ?>
								<input
									name="block-is-disabled-pro-field[<?php echo esc_attr( $uid ); ?>]"
									type="hidden"
									value="true"
								/>
							<?php endif; ?>
						</td>
					</tr>
					<tr class="block-fields-edit-name">
						<td class="spacer"></td>
						<th scope="row">
							<label for="block-fields-edit-name-input_<?php echo esc_attr( $uid ); ?>">
								<?php esc_html_e( 'Field Name', 'genesis-custom-blocks' ); ?>
							</label>
							<p class="description">
								<?php esc_html_e( 'Single word, no spaces.', 'genesis-custom-blocks' ); ?>
							</p>
						</th>
						<td>
							<input
								name="block-fields-name[<?php echo esc_attr( $uid ); ?>]"
								type="text"
								id="block-fields-edit-name-input_<?php echo esc_attr( $uid ); ?>"
								class="regular-text"
								value="<?php echo esc_attr( $field->name ); ?>"
								data-sync="block-fields-name-code_<?php echo esc_attr( $uid ); ?>"
								<?php echo $is_field_disabled ? 'readonly="readonly"' : ''; ?>
							/>
						</td>
					</tr>
					<tr class="block-fields-edit-control">
						<td class="spacer"></td>
						<th scope="row">
							<label for="block-fields-edit-control-input_<?php echo esc_attr( $uid ); ?>">
								<?php esc_html_e( 'Field Type', 'genesis-custom-blocks' ); ?>
							</label>
						</th>
						<td>
							<select
								name="block-fields-control[<?php echo esc_attr( $uid ); ?>]"
								id="block-fields-edit-control-input_<?php echo esc_attr( $uid ); ?>"
								data-sync="block-fields-control_<?php echo esc_attr( $uid ); ?>"
								<?php disabled( $is_field_disabled ); ?> >
								<?php
								$controls_for_select = $this->controls;

								// If this field is disabled, it was probably added when there was a valid pro license, so still display it.
								if ( $is_field_disabled && in_array( $field->control, $this->pro_controls, true ) ) {
									$controls_for_select[ $field->control ] = $this->get_control( $field->control );
								}

								// Don't allow nesting repeaters inside repeaters.
								if ( ! empty( $field->settings['parent'] ) ) {
									unset( $controls_for_select['repeater'] );
								}

								foreach ( $controls_for_select as $control_for_select ) :
									?>
									<option
										value="<?php echo esc_attr( $control_for_select->name ); ?>"
										<?php selected( $field->control, $control_for_select->name ); ?>>
										<?php echo esc_html( $control_for_select->label ); ?>
									</option>
								<?php endforeach; ?>
							</select>
						</td>
					</tr>
					<?php $this->render_field_settings( $field, $uid ); ?>
					<tr class="block-fields-edit-actions-close">
						<td class="spacer"></td>
						<th scope="row">
						</th>
						<td>
							<a class="button" title="<?php esc_attr_e( 'Close Field', 'genesis-custom-blocks' ); ?>" href="javascript:">
								<?php esc_html_e( 'Close Field', 'genesis-custom-blocks' ); ?>
							</a>
						</td>
					</tr>
				</table>
			</div>
			<?php
			if ( 'repeater' === $field->control ) {
				if ( ! isset( $field->settings['sub_fields'] ) ) {
					$field->settings['sub_fields'] = [];
				}
				$this->render_fields_sub_rows( $field->settings['sub_fields'], $uid );
			}
			if ( $parent_uid ) {
				?>
				<input
					type="hidden"
					name="block-fields-parent[<?php echo esc_attr( $uid ); ?>]"
					value="<?php echo esc_attr( $parent_uid ); ?>"
				/>
				<?php
			}
			?>
		</div>
		<?php
	}

	/**
	 * Render the actions row when adding a Repeater field.
	 *
	 * @param Field[] $fields     The sub fields to render.
	 * @param mixed   $parent_uid The unique ID of the field's parent.
	 *
	 * @return void
	 */
	public function render_fields_sub_rows( $fields = [], $parent_uid = false ) {
		?>
		<div class="block-fields-sub-rows">
			<?php
			if ( ! empty( $fields ) ) {
				foreach ( $fields as $field ) {
					$this->render_fields_meta_box_row( $field, uniqid(), $parent_uid );
				}
			}
			?>
		</div>
		<div class="block-fields-sub-rows-actions">
			<p class="repeater-no-fields <?php echo esc_attr( empty( $fields ) ? '' : 'hidden' ); ?>">
				<button type="button" aria-label="Add Sub-Field" id="block-add-sub-field">
					<span class="dashicons dashicons-plus"></span>
					<?php esc_attr_e( 'Add your first Sub-Field', 'genesis-custom-blocks' ); ?>
				</button>
			</p>
			<p class="repeater-has-fields <?php echo esc_attr( empty( $fields ) ? 'hidden' : '' ); ?>">
				<button type="button" aria-label="Add Sub-Field" id="block-add-sub-field">
					<span class="dashicons dashicons-plus"></span>
					<?php esc_attr_e( 'Add Sub-Field', 'genesis-custom-blocks' ); ?>
				</button>
			</p>
		</div>
		<?php
	}

	/**
	 * Render the Block Template meta box.
	 *
	 * @return void
	 */
	public function render_template_meta_box() {
		$post = get_post();
		?>
		<div class="template-notice">
			<h3>✔️ <?php esc_html_e( 'Next step: Create a block template.', 'genesis-custom-blocks' ); ?></h3>
			<p>
				<?php esc_html_e( 'To display this block, Genesis Custom Blocks will look for this template file in your theme:', 'genesis-custom-blocks' ); ?>
			</p>
			<?php
			// Formatting to make the template paths easier to understand.
			$template        = get_stylesheet_directory() . '/blocks/block-' . $post->post_name . '.php';
			$template_short  = str_replace( WP_CONTENT_DIR, basename( WP_CONTENT_DIR ), $template );
			$template_parts  = explode( '/', $template_short );
			$filename        = array_pop( $template_parts );
			$template_breaks = '/' . trailingslashit( implode( '/<wbr>', $template_parts ) );
			?>
			<p class="template-location">
				<span class="path"><?php echo wp_kses( $template_breaks, [ 'wbr' => [] ] ); ?></span>
				<a class="filename" data-tooltip="<?php esc_attr_e( 'Click to copy.', 'genesis-custom-blocks' ); ?>" href="#"><?php echo esc_html( $filename ); ?></a>
				<span class="click-to-copy">
					<input type="text" readonly="readonly" value="<?php echo esc_html( $filename ); ?>" />
				</span>
			</p>
			<p>
				<strong><?php esc_html_e( 'Learn more:', 'genesis-custom-blocks' ); ?></strong>
				<?php
				echo wp_kses_post(
					sprintf(
						'<a href="%1$s" target="_blank">%2$s</a> | ',
						'https://getblocklab.com/docs/get-started/add-a-block-lab-block-to-your-website-content/',
						esc_html__( 'Block Templates', 'genesis-custom-blocks' )
					)
				);
				echo wp_kses_post(
					sprintf(
						'<a href="%1$s" target="_blank">%2$s</a>',
						'https://getblocklab.com/docs/functions/',
						esc_html__( 'Template Functions', 'genesis-custom-blocks' )
					)
				);
				?>
			</p>
		</div>
		<?php
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
	 * Render the settings for a given field.
	 *
	 * @param Field  $field The Field containing the options to render.
	 * @param string $uid   A unique ID to used to unify the HTML name, for, and id attributes.
	 *
	 * @return void
	 */
	public function render_field_settings( $field, $uid ) {
		if ( isset( $this->controls[ $field->control ] ) ) {
			$this->controls[ $field->control ]->render_settings( $field, $uid );
		}
	}

	/**
	 * Ajax response for fetching field settings.
	 *
	 * @return void
	 */
	public function ajax_field_settings() {
		wp_verify_nonce( "{$this->slug}_field_options_nonce" );

		if ( ! isset( $_POST['control'] ) || ! isset( $_POST['uid'] ) ) {
			wp_send_json_error();
			return;
		}

		$control = sanitize_key( $_POST['control'] );
		$uid     = sanitize_key( $_POST['uid'] );

		ob_start();
		$field = new Field( [ 'control' => $control ] );

		if ( isset( $_POST['parent'] ) ) {
			$field->settings['parent'] = sanitize_key( $_POST['parent'] );
		}

		$this->render_field_settings( $field, $uid );
		$data['html'] = ob_get_clean();

		if ( '' === $data['html'] ) {
			wp_send_json_error();
		}

		wp_send_json_success( $data );
	}

	/**
	 * Save block meta boxes as a json blob in post content.
	 *
	 * @param array $data An array of slashed post data.
	 *
	 * @return array
	 */
	public function save_block( $data ) {
		if ( ! isset( $_POST['post_ID'] ) ) {
			return $data;
		}

		$post_id = sanitize_key( $_POST['post_ID'] );

		// Exits script depending on save status.
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return $data;
		}

		// Exits script if not the right post type.
		if ( $this->slug !== $data['post_type'] ) {
			return $data;
		}

		check_admin_referer( "{$this->slug}_save_fields", "{$this->slug}_fields_nonce" );
		check_admin_referer( "{$this->slug}_save_properties", "{$this->slug}_properties_nonce" );

		// Strip encoded special characters, like 🖖 (%f0%9f%96%96).
		$data['post_name'] = preg_replace( '/%[a-f|0-9][a-f|0-9]/', '', $data['post_name'] );

		// sanitize_title() allows underscores, but register_block_type doesn't.
		$data['post_name'] = str_replace( '_', '-', $data['post_name'] );

		// If only special characters were used, it's possible the post_name is now empty.
		if ( '' === $data['post_name'] ) {
			$data['post_name'] = $post_id;
		}

		// register_block_type doesn't allow slugs starting with a number.
		if ( is_numeric( $data['post_name'][0] ) ) {
			$data['post_name'] = 'block-' . $data['post_name'];
		}

		// Make sure the block slug is still unique.
		$data['post_name'] = wp_unique_post_slug(
			$data['post_name'],
			$post_id,
			$data['post_status'],
			$data['post_type'],
			$data['post_parent']
		);

		$block = new Block();

		// Block name.
		$block->name = sanitize_key( $data['post_name'] );
		if ( '' === $block->name ) {
			$block->name = $post_id;
		}

		// Block title.
		$block->title = sanitize_text_field(
			wp_unslash( $data['post_title'] )
		);
		if ( '' === $block->title ) {
			$block->title = $post_id;
		}

		// Block excluded post type.
		if ( isset( $_POST['block-excluded-post-types'] ) ) {
			$excluded = sanitize_text_field(
				wp_unslash( $_POST['block-excluded-post-types'] )
			);
			if ( ! empty( $excluded ) ) {
				$block->excluded = explode( ',', $excluded );
			}
		}

		// Block icon.
		if ( isset( $_POST['block-properties-icon'] ) ) {
			$block->icon = sanitize_key( $_POST['block-properties-icon'] );
		}

		// Block category.
		if ( isset( $_POST['block-properties-category'] ) ) {
			$category_slug = sanitize_key( $_POST['block-properties-category'] );
			$categories    = get_block_categories( get_post() );

			if ( '__custom' === $category_slug && isset( $_POST['block-properties-category-name'] ) ) {
				$category = [
					'slug'  => sanitize_key( $_POST['block-properties-category-name'] ),
					'title' => sanitize_text_field(
						wp_unslash( $_POST['block-properties-category-name'] )
					),
					'icon'  => null,
				];
			} else {
				$category_slugs = wp_list_pluck( $categories, 'slug' );
				$category_key   = array_search( $category_slug, $category_slugs, true );
				$category       = $categories[ $category_key ];
			}

			if ( ! $category ) {
				$category = isset( $categories[0] ) ? $categories[0] : '';
			}

			$block->category = $category;
		}

		// Block keywords.
		if ( isset( $_POST['block-properties-keywords'] ) ) {
			$keywords = sanitize_text_field(
				wp_unslash( $_POST['block-properties-keywords'] )
			);
			$keywords = explode( ',', $keywords );
			$keywords = array_map( 'trim', $keywords );
			$keywords = array_slice( $keywords, 0, 3 );

			$block->keywords = $keywords;
		}

		// Block fields.
		if ( isset( $_POST['block-fields-name'] ) && is_array( $_POST['block-fields-name'] ) ) {
			// We loop through this array and sanitize its content according to the content type.
			$fields = wp_unslash( $_POST['block-fields-name'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			foreach ( $fields as $key => $name ) {
				// Field name and order.
				$field_config = [ 'name' => sanitize_key( $name ) ];

				// Field label.
				if ( isset( $_POST['block-fields-label'][ $key ] ) ) {
					$field_config['label'] = sanitize_text_field(
						wp_unslash( $_POST['block-fields-label'][ $key ] )
					);
				}

				// Field control.
				if ( isset( $_POST['block-fields-control'][ $key ] ) ) {
					$field_config['control'] = sanitize_text_field(
						wp_unslash( $_POST['block-fields-control'][ $key ] )
					);
				}

				// Field type.
				if ( isset( $field_config['control'] ) && isset( $this->controls[ $field_config['control'] ] ) ) {
					$field_config['type'] = $this->controls[ $field_config['control'] ]->type;
				}

				/*
				 * Field settings.
				 * If the field is a pro field that's no longer available, re-save the previous value of that field.
				 * This allows saving other new fields, while retaining the previous pro field value in case the user reactivates the license.
				 */
				if ( ! empty( $_POST['block-is-disabled-pro-field'][ $key ] ) ) {
					$previous_block = new Block( $post_id );
					foreach ( $previous_block->fields as $previous_field ) {
						if ( $name === $previous_field->name ) {
							$field = $previous_field;
							break;
						}
					}
				} elseif ( isset( $field_config['control'] ) && isset( $this->controls[ $field_config['control'] ] ) ) {
					$control = $this->controls[ $field_config['control'] ];
					foreach ( $control->settings as $setting ) {
						$value = false; // This is a good default, it allows us to pick up on unchecked checkboxes.

						if ( isset( $_POST['block-fields-settings'][ $key ][ $setting->name ] ) ) {
							$value = $_POST['block-fields-settings'][ $key ][ $setting->name ]; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
							$value = wp_unslash( $value );
						}

						// Sanitize the field options according to their type.
						if ( is_callable( $setting->sanitize ) ) {
							$value = call_user_func( $setting->sanitize, $value );
						}

						// Validate the field options according to their type.
						if ( is_callable( $setting->validate ) ) {
							$value = call_user_func(
								$setting->validate,
								$value,
								$field_config['settings']
							);
						}

						$field_config['settings'][ $setting->name ] = $value;

						$field = new Field( $field_config );
					}
				} else {
					$field = new Field( $field_config );
				}

				/*
				 * Sub-Fields
				 * If there's a "block-fields-parent" input, include the current field in a "sub-fields" field setting
				 * for the specified parent.
				 */
				if ( ! empty( $_POST['block-fields-parent'][ $key ] ) ) {
					$parent_uid = sanitize_key( $_POST['block-fields-parent'][ $key ] );

					// The parent's name should have been submitted.
					if ( ! isset( $fields[ $parent_uid ] ) ) {
						continue;
					}

					$parent = $fields[ $parent_uid ];

					// The parent field should be set by now. We expect it to always precede the child field.
					if ( ! isset( $block->fields[ $parent ] ) ) {
						continue;
					}

					if ( ! isset( $block->fields[ $parent ]->settings['sub_fields'] ) ) {
						$block->fields[ $parent ]->settings['sub_fields'] = [];
					}

					$field->settings['parent'] = $parent;
					$field->order              = count(
						$block->fields[ $parent ]->settings['sub_fields']
					);

					$block->fields[ $parent ]->settings['sub_fields'][ $name ] = $field;
				} else {
					$field->order = count( $block->fields );

					$block->fields[ $name ] = $field;
				}
			}
		}

		$data['post_content'] = wp_slash( $block->to_json() );
		return $data;
	}

	/**
	 * Change the default "Enter Title Here" placeholder on the edit post screen.
	 *
	 * @param string $title Placeholder text. Default 'Enter title here'.
	 *
	 * @return string
	 */
	public function post_title_placeholder( $title ) {
		$screen = get_current_screen();

		// Enqueue scripts and styles on the edit screen of the Block post type.
		if ( is_object( $screen ) && $this->slug === $screen->post_type ) {
			$title = __( 'Enter block name here', 'genesis-custom-blocks' );
		}

		return $title;
	}

	/**
	 * Displays an option for editing the post type that this block appears on.
	 */
	public function post_type_condition() {
		if ( ! genesis_custom_blocks()->is_pro() ) {
			return;
		}

		$screen = get_current_screen();

		// Enqueue scripts and styles on the edit screen of the Block post type.
		if ( ! is_object( $screen ) || $this->slug !== $screen->post_type ) {
			return;
		}

		$post_types = get_post_types(
			[
				'show_in_rest' => true,
				'show_in_menu' => true,
			],
			'objects'
		);

		$post_types = array_filter(
			$post_types,
			function( $post_type ) {
				return post_type_supports( $post_type->name, 'editor' );
			}
		);

		$block = new Block( get_the_ID() );
		?>
		<div class="genesis-custom-blocks-pub-section hide-if-no-js">
			<?php esc_html_e( 'Post Types:', 'genesis-custom-blocks' ); ?> <span class="post-types-display"></span>
			<a href="#post-types-select" class="edit-post-types" role="button">
				<span aria-hidden="true"><?php esc_html_e( 'Edit', 'genesis-custom-blocks' ); ?></span>
			</a>
			<input type="hidden" value="<?php echo esc_attr( implode( ',', $block->excluded ) ); ?>" name="block-excluded-post-types" id="block-excluded-post-types" />
			<div class="post-types-select">
				<div class="post-types-select-items">
					<?php
					foreach ( $post_types as $post_type ) {
						?>
						<input type="checkbox" id="block-post-type-<?php echo esc_attr( $post_type->name ); ?>" value="<?php echo esc_attr( $post_type->name ); ?>">
						<label for="block-post-type-<?php echo esc_attr( $post_type->name ); ?>"><?php echo esc_html( $post_type->label ); ?></label>
						<br />
						<?php
					}
					?>
				</div>
				<a href="#post-types" class="save-post-types button"><?php esc_html_e( 'OK', 'genesis-custom-blocks' ); ?></a>
				<a href="#post-types" class="button-cancel"><?php esc_html_e( 'Cancel', 'genesis-custom-blocks' ); ?></a>
			</div>
		</div>
		<?php
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
			'icon'     => __( 'Icon', 'genesis-custom-blocks' ),
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
		if ( 'icon' === $column ) {
			$block = new Block( $post_id );
			$icons = genesis_custom_blocks()->get_icons();

			if ( isset( $icons[ $block->icon ] ) ) {
				printf(
					'<span class="icon %1$s">%2$s</span>',
					esc_attr( $block->icon ),
					wp_kses( $icons[ $block->icon ], genesis_custom_blocks()->allowed_svg_tags() )
				);
			}
		}
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

		// Add the Export link.
		if ( genesis_custom_blocks()->is_pro() ) {
			$export = [
				'export' => sprintf(
					'<a href="%1$s" aria-label="%2$s">%3$s</a>',
					add_query_arg( [ 'export' => $post->ID ] ),
					sprintf(
						// translators: Placeholder is a post title.
						__( 'Export %1$s', 'genesis-custom-blocks' ),
						get_the_title( $post->ID )
					),
					__( 'Export', 'genesis-custom-blocks' )
				),
			];

			$actions = array_merge(
				array_slice( $actions, 0, 1 ),
				$export,
				array_slice( $actions, 1 )
			);
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

		if ( genesis_custom_blocks()->is_pro() ) {
			$actions['export'] = __( 'Export', 'genesis-custom-blocks' );
		}

		return $actions;
	}

	/**
	 * Handle the Export of a single block.
	 */
	public function row_export() {
		if ( ! genesis_custom_blocks()->is_pro() ) {
			return;
		}

		$post_id = filter_input( INPUT_GET, 'export', FILTER_SANITIZE_NUMBER_INT );

		// Check if the export has been requested, and the user has permission.
		if ( $post_id <= 0 || ! current_user_can( "{$this->slug}_read_block", $post_id ) ) {
			return;
		}

		$this->export( [ $post_id ] );
	}

	/**
	 * Handle Exporting blocks via Bulk Actions
	 *
	 * @param string $redirect Location to redirect to after the bulk action is completed.
	 * @param string $action The action to handle.
	 * @param array  $post_ids The IDs to handle.
	 *
	 * @return string
	 */
	public function bulk_export( $redirect, $action, $post_ids ) {
		if ( ! genesis_custom_blocks()->is_pro() ) {
			return $redirect;
		}

		if ( 'export' !== $action ) {
			return $redirect;
		}

		$this->export( $post_ids );

		$redirect = add_query_arg( 'bulk_export', count( $post_ids ), $redirect );
		return $redirect;
	}

	/**
	 * Export Blocks
	 *
	 * @param int[] $post_ids The post IDs to export.
	 */
	private function export( $post_ids ) {
		$blocks = [];

		foreach ( $post_ids as $post_id ) {
			$post = get_post( $post_id );

			if ( ! $post ) {
				break;
			}

			// Check that the post content is valid JSON.
			$block = json_decode( $post->post_content, true );

			if ( JSON_ERROR_NONE !== json_last_error() ) {
				break;
			}

			$blocks = array_merge( $blocks, $block );
		}

		// If only one block is being exported, use the block's slug as the filename.
		$filename = 'blocks.json';
		if ( 1 === count( $post_ids ) ) {
			$post     = get_post( $post_ids[0] );
			$filename = $post->post_name . '.json';
		}

		// Output the JSON file.
		header( 'Content-disposition: attachment; filename=' . $filename );
		header( 'Content-type:application/json;charset=utf-8' );
		echo wp_json_encode( $blocks ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		die();
	}
}