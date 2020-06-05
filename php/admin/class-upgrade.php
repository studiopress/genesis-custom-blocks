<?php
/**
 * Genesis Custom Blocks Upgrade Page.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\Component_Abstract;

/**
 * Class Upgrade
 */
class Upgrade extends Component_Abstract {

	/**
	 * Page slug.
	 *
	 * @var string
	 */
	public $slug = 'genesis-custom-blocks-pro';

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_action( 'admin_menu', [ $this, 'add_submenu_pages' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Enqueue scripts and styles used by the Upgrade screen.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
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
		add_submenu_page(
			'edit.php?post_type=genesis_custom_block',
			__( 'Genesis Custom Blocks Pro', 'genesis-custom-blocks' ),
			__( 'Go Pro', 'genesis-custom-blocks' ),
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
			<?php include genesis_custom_blocks()->get_path() . 'php/views/upgrade.php'; ?>
		</div>
		<?php
	}
}
