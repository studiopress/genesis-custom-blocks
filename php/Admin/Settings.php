<?php
/**
 * Genesis Custom Blocks Settings.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class Settings
 */
class Settings extends ComponentAbstract {

	/**
	 * Option name for the notices.
	 *
	 * @var string
	 */
	const NOTICES_OPTION_NAME = 'genesis_custom_blocks_notices';

	/**
	 * Page slug.
	 *
	 * @var string
	 */
	public $slug = 'genesis-custom-blocks-settings';

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_action( 'admin_menu', [ $this, 'add_submenu_pages' ] );
		add_action( 'admin_init', [ $this, 'register_settings' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'admin_notices', [ $this, 'show_notices' ] );
	}

	/**
	 * Enqueue scripts and styles used by the Settings screen.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$page = filter_input( INPUT_GET, 'page', FILTER_SANITIZE_STRING );

		// Enqueue scripts and styles on the edit screen of the Block post type.
		if ( $this->slug === $page ) {
			wp_enqueue_style(
				$this->slug,
				$this->plugin->get_url( 'css/admin.settings.css' ),
				[],
				$this->plugin->get_version()
			);
		}
	}

	/**
	 * Add submenu pages to the Genesis Custom Blocks menu.
	 */
	public function add_submenu_pages() {
		add_submenu_page(
			'edit.php?post_type=' . genesis_custom_blocks()->get_post_type_slug(),
			__( 'Genesis Custom Blocks Settings', 'genesis-custom-blocks' ),
			__( 'Settings', 'genesis-custom-blocks' ),
			'manage_options',
			$this->slug,
			[ $this, 'render_page' ]
		);
	}

	/**
	 * Register Genesis Custom Blocks settings.
	 */
	public function register_settings() {
		register_setting( Subscription::SUBSCRIPTION_KEY_SETTINGS_GROUP, Subscription::SUBSCRIPTION_KEY_OPTION_NAME );
	}

	/**
	 * Render the Settings page.
	 */
	public function render_page() {
		?>
		<div class="wrap genesis-custom-blocks-settings">
			<?php
			$this->render_page_header();
			?>
		</div>
		<?php
	}

	/**
	 * Render the Settings page header.
	 */
	public function render_page_header() {
		?>
		<h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
		<h2 class="nav-tab-wrapper">
			<a href="<?php echo esc_url( add_query_arg( 'tab', 'subscription' ) ); ?>" title="<?php esc_attr_e( 'Subscription', 'genesis-custom-blocks' ); ?>" class="nav-tab nav-tab-active dashicons-before dashicons-nametag">
				<?php esc_html_e( 'Subscription', 'genesis-custom-blocks' ); ?>
			</a>
			<a href="https://developer.wpengine.com/genesis-custom-blocks" target="_blank" class="nav-tab dashicons-before dashicons-info">
				<?php esc_html_e( 'Documentation', 'genesis-custom-blocks' ); ?>
			</a>
			<a href="https://wordpress.org/support/plugin/genesis-custom-blocks/" target="_blank" class="nav-tab dashicons-before dashicons-sos">
				<?php esc_html_e( 'Help', 'genesis-custom-blocks' ); ?>
			</a>
		</h2>
		<?php
	}

	/**
	 * Prepare notices to be displayed after saving the settings.
	 *
	 * @param string $notice The notice text to display.
	 */
	public function prepare_notice( $notice ) {
		$notices   = get_option( self::NOTICES_OPTION_NAME, [] );
		$notices[] = $notice;
		update_option( self::NOTICES_OPTION_NAME, $notices );
	}

	/**
	 * Show any admin notices after saving the settings.
	 */
	public function show_notices() {
		$notices = get_option( self::NOTICES_OPTION_NAME, [] );

		if ( empty( $notices ) || ! is_array( $notices ) ) {
			return;
		}

		foreach ( $notices as $notice ) {
			echo wp_kses_post( $notice );
		}

		delete_option( self::NOTICES_OPTION_NAME );
	}
}
