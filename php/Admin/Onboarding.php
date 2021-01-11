<?php
/**
 * User onboarding.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;
use Genesis\CustomBlocks\Blocks\Block;

/**
 * Class Onboarding
 */
class Onboarding extends ComponentAbstract {

	/**
	 * The transient for whether to show the welcome notice.
	 *
	 * @var string
	 */
	const SHOW_WELCOME_TRANSIENT = 'genesis_custom_blocks_show_welcome';

	/**
	 * Option name.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'genesis_custom_blocks_example_post_id';

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_action( 'current_screen', [ $this, 'admin_notices' ] );
	}

	/**
	 * Runs during plugin activation.
	 */
	public function plugin_activation() {
		$this->add_dummy_data();
		$this->prepare_welcome_notice();
	}

	/**
	 * Prepare onboarding notices.
	 */
	public function admin_notices() {
		$example_post_id = get_option( self::OPTION_NAME );

		if ( ! $example_post_id ) {
			return;
		}

		$screen = get_current_screen();
		$slug   = genesis_custom_blocks()->get_post_type_slug();

		if ( ! is_object( $screen ) ) {
			return;
		}

		$post_id = filter_input( INPUT_GET, 'post', FILTER_SANITIZE_NUMBER_INT );

		/*
		 * On the edit post screen, editing the Example Block.
		 */
		if ( $slug === $screen->id && 'post' === $screen->base && $post_id === $example_post_id ) {
			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
			add_action( 'genesis_custom_blocks_before_fields_list', [ $this, 'show_add_to_post_notice' ] );
		}

		if ( 'draft' !== get_post_status( $example_post_id ) ) {
			return;
		}

		/*
		 * On the plugins screen, immediately after activating Genesis Custom Blocks.
		 */
		if ( 'plugins' === $screen->id && 'true' === get_transient( self::SHOW_WELCOME_TRANSIENT ) ) {
			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
			add_action( 'admin_notices', [ $this, 'show_welcome_notice' ] );
		}

		/*
		 * On the All Blocks screen, when a draft Example Block exists.
		 */
		if ( "edit-{$slug}" === $screen->id ) {
			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
			add_action( 'admin_notices', [ $this, 'show_edit_block_notice' ] );
		}

		/*
		 * On the edit post screen, editing the draft Example Block.
		 */
		if ( $slug === $screen->id && 'post' === $screen->base && $post_id === $example_post_id ) {
			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
			add_action( 'edit_form_advanced', [ $this, 'show_add_fields_notice' ] );
			add_action( 'edit_form_before_permalink', [ $this, 'show_publish_notice' ] );

			add_action(
				'add_meta_boxes',
				function() use ( $slug ) {
					remove_meta_box( 'block_template', $slug, 'normal' );
				},
				20
			);
		}
	}

	/**
	 * Prepare the welcome notice on plugin activation.
	 *
	 * We can't hook into admin_notices at this point, so instead we set a short
	 * transient, and check that transient during the next page load.
	 */
	public function prepare_welcome_notice() {
		set_transient( self::SHOW_WELCOME_TRANSIENT, 'true', 1 );
	}

	/**
	 * Enqueue scripts and styles used by the onboarding screens.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_style(
			'genesis-custom-blocks-onboarding-css',
			$this->plugin->get_url( 'css/admin.onboarding.css' ),
			[],
			$this->plugin->get_version()
		);
	}

	/**
	 * Render the Welcome message.
	 */
	public function show_welcome_notice() {
		$example_post_id = get_option( self::OPTION_NAME );

		if ( ! $example_post_id ) {
			return;
		}
		?>
		<div class="genesis-custom-blocks-welcome genesis-custom-blocks-notice notice is-dismissible">
			<h2><span role="image" aria-label="<?php esc_attr_e( 'Waving hand emoji', 'genesis-custom-blocks' ); ?>">👋</span> <?php esc_html_e( 'Hi, and welcome!', 'genesis-custom-blocks' ); ?></h2>
			<p class="intro"><?php esc_html_e( 'Genesis Custom Blocks makes it easy to build your own blocks for the WordPress editor.', 'genesis-custom-blocks' ); ?></p>
			<p><strong><?php esc_html_e( 'Want to see how it\'s done?', 'genesis-custom-blocks' ); ?></strong> <?php esc_html_e( 'Here\'s one we prepared earlier.', 'genesis-custom-blocks' ); ?></p>
			<?php
			edit_post_link(
				__( 'Let\'s get started!', 'genesis-custom-blocks' ),
				'<p>',
				'</p>',
				$example_post_id,
				'button button--white button_cta'
			);
			?>
			<p class="ps"><?php esc_html_e( 'P.S. We don\'t like to nag. This message won\'t be shown again.', 'genesis-custom-blocks' ); ?></p>
			<p class="ps">
				<?php
				esc_html_e( 'Prefer to look at the docs?', 'genesis-custom-blocks' );
				printf(
					'&nbsp;<a href="%1$s" target="_blank" rel="noreferrer noopener">%2$s</a>',
					'https://developer.wpengine.com/genesis-custom-blocks',
					esc_html__( 'Start here', 'genesis-custom-blocks' )
				);
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Render the Edit Your First Block message.
	 */
	public function show_edit_block_notice() {
		$example_post_id = get_option( self::OPTION_NAME );

		if ( ! $example_post_id ) {
			return;
		}
		?>
		<div class="genesis-custom-blocks-edit-block genesis-custom-blocks-notice notice">
			<h2><span role="image" aria-label="<?php esc_attr_e( 'Scientist emoji', 'genesis-custom-blocks' ); ?>">👩</span> <span role="image" aria-label="<?php esc_attr_e( 'Stethescope emoji', 'genesis-custom-blocks' ); ?>">🔬</span> <?php echo esc_html_e( 'Ready to begin?', 'genesis-custom-blocks' ); ?></h2>
			<p class="intro">
				<?php
				echo wp_kses_post(
					sprintf(
						// translators: Placeholders are <strong> html tags.
						__( 'We created this %1$sExample Block%2$s to show you just how easy it is to get started.', 'genesis-custom-blocks' ),
						'<strong>',
						'</strong>'
					)
				);
				?>
			</p>
			<p>
				<?php
				echo wp_kses_post(
					sprintf(
						// translators: Placeholders are <strong> and <a> html tags.
						__( 'You can %1$sEdit%2$s the block to learn more, or just %3$sTrash%4$s it to dismiss this message.', 'genesis-custom-blocks' ),
						'<strong>',
						'</strong>',
						'<a href="' . get_delete_post_link( $example_post_id ) . '" class="trash">',
						'</a>'
					)
				);
				?>
			</p>
			<p>
				<?php
				esc_html_e( 'Learn more:', 'genesis-custom-blocks' );
				printf(
					'&nbsp;<a href="%1$s" target="_blank" rel="noreferrer noopener">%2$s</a>',
					'https://developer.wpengine.com/genesis-custom-blocks/get-started/',
					esc_html__( 'Get Started', 'genesis-custom-blocks' )
				);
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Render the Add Fields message.
	 */
	public function show_add_fields_notice() {
		$post  = get_post();
		$block = new Block( $post->ID );

		/*
		 * We add 4 fields to our Example Block in add_dummy_data().
		 */
		if ( count( $block->fields ) > 4 ) {
			return;
		}
		?>
		<div class="genesis-custom-blocks-add-fields genesis-custom-blocks-notice">
			<h2><span role="image" aria-label="<?php esc_attr_e( 'Eyeglass emoji', 'genesis-custom-blocks' ); ?>">🧐</span> <?php esc_html_e( 'Try adding a field.', 'genesis-custom-blocks' ); ?></h2>
			<p><?php esc_html_e( 'Fields let you define the options you see when adding your block to a post or page.', 'genesis-custom-blocks' ); ?></p>
			<p><?php esc_html_e( 'There are lots of different field types that let you build powerfully dynamic custom blocks.', 'genesis-custom-blocks' ); ?></p>
			<p>
				<?php
				esc_html_e( 'Learn more:', 'genesis-custom-blocks' );
				printf(
					'&nbsp;<a href="%1$s" target="_blank" rel="noreferrer noopener">%2$s</a>',
					'https://developer.wpengine.com/genesis-custom-blocks/fields/',
					esc_html__( 'Field Types', 'genesis-custom-blocks' )
				);
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Render the Add Fields message.
	 */
	public function show_publish_notice() {
		$block = new Block( get_the_ID() );

		/**
		 * We add 4 fields to our Example Block in add_dummy_data().
		 */
		if ( count( $block->fields ) > 4 ) {
			return;
		}
		?>
		<div class="genesis-custom-blocks-publish genesis-custom-blocks-notice">
			<h2><span role="image" aria-label="<?php esc_attr_e( 'Test tube emoji', 'genesis-custom-blocks' ); ?>">🧪</span> <?php esc_html_e( 'Time to experiment!', 'genesis-custom-blocks' ); ?></h2>
			<ol class="intro">
				<li><?php esc_html_e( 'Choose an icon', 'genesis-custom-blocks' ); ?></li>
				<li><?php esc_html_e( 'Change the category', 'genesis-custom-blocks' ); ?></li>
				<li><?php esc_html_e( 'Investigate a few different field types', 'genesis-custom-blocks' ); ?></li>
			</ol>
			<p>
				<?php
				echo wp_kses_post(
					sprintf(
						// translators: Placeholders are <strong> html tags.
						__( 'When you\'re ready, save your block by pressing %1$sPublish%2$s.', 'genesis-custom-blocks' ),
						'<strong>',
						'</strong>'
					)
				);
				?>
			</p>
			<p>
				<?php
				esc_html_e( 'Learn more:', 'genesis-custom-blocks' );
				printf(
					'&nbsp;<a href="%1$s" target="_blank" rel="noreferrer noopener">%2$s</a>',
					'https://developer.wpengine.com/genesis-custom-blocks/get-started/',
					esc_html__( 'Get Started', 'genesis-custom-blocks' )
				);
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Render the Add to Post message.
	 */
	public function show_add_to_post_notice() {
		$post = get_post();

		if ( ! $post || ! isset( $post->post_name ) || empty( $post->post_name ) ) {
			return;
		}

		if ( 'publish' !== $post->post_status ) {
			return;
		}

		$template = genesis_custom_blocks()->locate_template( "blocks/block-{$post->post_name}.php", '', true );

		if ( ! $template ) {
			return;
		}
		?>
		<div class="genesis-custom-blocks-add-to-block genesis-custom-blocks-notice notice notice-large is-dismissible">
			<h2>🚀 <?php esc_html_e( 'Only one thing left to do!', 'genesis-custom-blocks' ); ?></h2>
			<p class="intro"><?php esc_html_e( 'You\'ve created a new block, and added a block template. Well done!', 'genesis-custom-blocks' ); ?></p>
			<p><?php esc_html_e( 'All that\'s left is to add your block to a post.', 'genesis-custom-blocks' ); ?></p>
			<a href="<?php echo esc_attr( admin_url( 'post-new.php' ) ); ?>" class="button">
				<?php esc_html_e( 'Add New Post', 'genesis-custom-blocks' ); ?>
			</a>
		</div>
		<?php
		/*
		 * After we've shown the Add to Post message once, we can delete the option. This will
		 * ensure that no further onboarding messages are shown.
		 */
		delete_option( self::OPTION_NAME );
	}

	/**
	 * Create a dummy starter block when the plugin is activated for the first time.
	 */
	public function add_dummy_data() {
		/*
		 * Check if there are any block posts already added, and if so, bail.
		 * Note: wp_count_posts() does not work here.
		 */
		$blocks = get_posts(
			[
				'post_type'   => genesis_custom_blocks()->get_post_type_slug(),
				'numberposts' => '1',
				'post_status' => 'any',
				'fields'      => 'ids',
			]
		);

		if ( count( $blocks ) > 0 ) {
			return;
		}

		$categories = get_block_categories( get_post() );

		$example_post_id = wp_insert_post(
			[
				'post_title'   => __( 'Example Block', 'genesis-custom-blocks' ),
				'post_name'    => 'example-block',
				'post_status'  => 'draft',
				'post_type'    => genesis_custom_blocks()->get_post_type_slug(),
				'post_content' => wp_json_encode(
					[
						'genesis-custom-blocks\/example-block' => [
							'name'     => 'example-block',
							'title'    => __( 'Example Block', 'genesis-custom-blocks' ),
							'icon'     => 'genesis_custom_blocks',
							'category' => isset( $categories[0] ) ? $categories[0] : [],
							'keywords' => [
								__( 'sample', 'genesis-custom-blocks' ), // translators: A keyword, used for search.
								__( 'tutorial', 'genesis-custom-blocks' ), // translators: A keyword, used for search.
								__( 'template', 'genesis-custom-blocks' ), // translators: A keyword, used for search.
							],
							'fields'   => [
								'title'       => [
									'name'        => 'title',
									'label'       => __( 'Title', 'genesis-custom-blocks' ),
									'control'     => 'text',
									'type'        => 'string',
									'location'    => 'editor',
									'order'       => 0,
									'help'        => __( 'The primary display text', 'genesis-custom-blocks' ),
									'default'     => '',
									'placeholder' => '',
									'maxlength'   => null,
								],
								'description' => [
									'name'        => 'description',
									'label'       => __( 'Description', 'genesis-custom-blocks' ),
									'control'     => 'textarea',
									'type'        => 'string',
									'location'    => 'editor',
									'order'       => 1,
									'help'        => '',
									'default'     => '',
									'placeholder' => '',
									'maxlength'   => null,
									'number_rows' => 4,
								],
								'button-text' => [
									'name'        => 'button-text',
									'label'       => __( 'Button Text', 'genesis-custom-blocks' ),
									'control'     => 'text',
									'type'        => 'string',
									'location'    => 'editor',
									'order'       => 2,
									'help'        => __( 'A Call-to-Action', 'genesis-custom-blocks' ),
									'default'     => '',
									'placeholder' => '',
									'maxlength'   => null,
								],
								'button-link' => [
									'name'        => 'button-link',
									'label'       => __( 'Button Link', 'genesis-custom-blocks' ),
									'control'     => 'url',
									'type'        => 'string',
									'location'    => 'editor',
									'order'       => 3,
									'help'        => __( 'The destination URL', 'genesis-custom-blocks' ),
									'default'     => '',
									'placeholder' => '',
								],
							],
						],
					]
				),
			]
		);

		if ( ! is_wp_error( $example_post_id ) ) {
			update_option( self::OPTION_NAME, $example_post_id );
		}
	}
}
