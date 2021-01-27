<?php
/**
 * Genesis Custom Blocks Upgrade Page.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class Upgrade
 */
class Upgrade extends ComponentAbstract {

	/**
	 * The default value for whether to show the Pro nag.
	 *
	 * @var bool
	 */
	const DEFAULT_SHOW_PRO_NAG = true;

	/**
	 * Page slug.
	 *
	 * @var string
	 */
	public $slug = 'genesis-custom-blocks-pro';

	/**
	 * Registers any hooks that this component needs.
	 */
	public function register_hooks() {
		add_action( 'admin_menu', [ $this, 'add_submenu_pages' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Enqueues scripts and styles used by the Upgrade screen.
	 */
	public function enqueue_scripts() {
		/**
		 * Whether to show the pro nag.
		 *
		 * @param bool
		 */
		$show_pro_nag = apply_filters( 'genesis_custom_blocks_show_pro_nag', self::DEFAULT_SHOW_PRO_NAG );
		if ( ! $show_pro_nag ) {
			return;
		}

		$page = filter_input( INPUT_GET, 'page', FILTER_SANITIZE_STRING );

		// Enqueue scripts and styles on the edit screen of the Block post type.
		if ( $this->slug === $page ) {
			wp_enqueue_style(
				$this->slug,
				$this->plugin->get_url( 'css/admin.upgrade.css' ),
				[],
				$this->plugin->get_version()
			);
		}
	}

	/**
	 * Add submenu pages to the Genesis Custom Blocks menu.
	 */
	public function add_submenu_pages() {
		/** This filter is documented in enqueue_scripts() */
		$show_pro_nag = apply_filters( 'genesis_custom_blocks_show_pro_nag', self::DEFAULT_SHOW_PRO_NAG );
		if ( ! $show_pro_nag ) {
			return;
		}

		add_submenu_page(
			'edit.php?post_type=genesis_custom_block',
			__( 'Genesis Custom Blocks Pro', 'genesis-custom-blocks' ),
			__( 'Genesis Pro', 'genesis-custom-blocks' ),
			'manage_options',
			$this->slug,
			[ $this, 'render_page' ]
		);
	}

	/**
	 * Render the Upgrade page.
	 */
	public function render_page() {
		?>
		<div class="wrap genesis-custom-blocks-pro">
			<h2 class="screen-reader-text"><?php echo esc_html( get_admin_page_title() ); ?></h2>
			<?php include genesis_custom_blocks()->get_path() . 'php/Views/Upgrade.php'; ?>
		</div>
		<?php
	}
}
