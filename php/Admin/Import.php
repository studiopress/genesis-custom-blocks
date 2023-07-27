<?php
/**
 * Genesis Custom Blocks Importer.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class Import
 */
class Import extends ComponentAbstract {

	/**
	 * Importer slug.
	 *
	 * @var string
	 */
	public $slug = 'genesis-custom-blocks';

	/**
	 * The filesystem.
	 *
	 * @var WP_Filesystem_Base
	 */
	private $filesystem;

	/**
	 * Construct the class.
	 *
	 * @param WP_Filesystem_Base $filesystem The filesystem.
	 */
	public function __construct( $filesystem ) {
		$this->filesystem = $filesystem;
	}

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_action( 'admin_init', [ $this, 'register_importer' ] );
	}

	/**
	 * Register the importer for the Tools > Import admin screen
	 */
	public function register_importer() {
		register_importer(
			$this->slug,
			__( 'Genesis Custom Blocks', 'genesis-custom-blocks' ),
			__( 'Import custom blocks created with Genesis Custom Blocks.', 'genesis-custom-blocks' ),
			[ $this, 'render_page' ]
		);
	}

	/**
	 * Render the import page. Manages the three separate stages of the JSON import process.
	 */
	public function render_page() {
		$step = filter_input( INPUT_GET, 'step', FILTER_SANITIZE_NUMBER_INT );

		ob_start();

		$this->render_page_header();

		switch ( $step ) {
			case 0:
			default:
				$this->render_welcome();
				break;
			case 1:
				check_admin_referer( 'import-upload' );

				$upload_dir = wp_get_upload_dir();

				if ( ! isset( $upload_dir['basedir'] ) ) {
					$this->render_import_error(
						__( 'Sorry, there was an error uploading the file.', 'genesis-custom-blocks' ),
						__( 'Upload base directory not set.', 'genesis-custom-blocks' )
					);
				}

				$cache_dir = $upload_dir['basedir'] . '/genesis-custom-blocks';
				$file      = wp_import_handle_upload();

				if ( $this->validate_upload( $file ) ) {
					if ( ! file_exists( $cache_dir ) ) {
						$this->filesystem->mkdir( $cache_dir, 0777 );
					}

					$this->filesystem->put_contents( $cache_dir . '/import.json', $this->filesystem->get_contents( $file['file'] ) );

					$json   = $this->filesystem->get_contents( $file['file'] );
					$blocks = json_decode( $json, true );

					$this->render_choose_blocks( $blocks );
				}
				break;
			case 2:
				$cache_dir = wp_get_upload_dir()['basedir'] . '/genesis-custom-blocks';
				$file      = [ 'file' => $cache_dir . '/import.json' ];

				if ( $this->validate_upload( $file ) ) {
					$json   = $this->filesystem->get_contents( $file['file'] );
					$blocks = json_decode( $json, true );

					$import_blocks = [];
					foreach ( $blocks as $block_namespace => $block ) {
						if ( 'on' === filter_input( INPUT_GET, $block_namespace ) ) {
							$import_blocks[ $block_namespace ] = $block;
						}
					}

					$this->import_blocks( $import_blocks );
				}

				break;
		}

		$html = ob_get_clean();
		echo '<div class="wrap genesis-custom-blocks-import">' . $html . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Render the Import page header.
	 */
	public function render_page_header() {
		?>
		<h2><?php esc_html_e( 'Import Genesis Custom Blocks', 'genesis-custom-blocks' ); ?></h2>
		<?php
	}

	/**
	 * Render the welcome message.
	 */
	public function render_welcome() {
		?>
		<p><?php esc_html_e( 'Welcome! This importer processes Genesis Custom Blocks JSON files, adding custom blocks to this site.', 'genesis-custom-blocks' ); ?></p>
		<p><?php esc_html_e( 'Choose a JSON (.json) file to upload, then click Upload file and import.', 'genesis-custom-blocks' ); ?></p>
		<p>
			<?php
			echo wp_kses(
				sprintf(
					/* translators: %1$s: an opening anchor tag, %2$s: a closing anchor tag */
					__( 'This JSON file should come from the export link or bulk action in the %1$sContent Blocks screen%2$s, not from the main Export tool.', 'genesis-custom-blocks' ),
					sprintf(
						'<a href="%1$s">',
						esc_url(
							admin_url(
								add_query_arg(
									[ 'post_type' => genesis_custom_blocks()->get_post_type_slug() ],
									'edit.php'
								)
							)
						)
					),
					'</a>'
				),
				[ 'a' => [ 'href' => [] ] ]
			);
			?>
		</p>

		<?php
		wp_import_upload_form(
			add_query_arg(
				[
					'import' => $this->slug,
					'step'   => 1,
				]
			)
		);
	}

	/**
	 * Render the currently importing block title.
	 *
	 * @param string $title The title of the block.
	 */
	public function render_import_success( $title ) {
		echo wp_kses_post(
			sprintf(
				'<p>%s</p>',
				sprintf(
					// translators: placeholder refers to title of custom block.
					__( 'Successfully imported %1$s.', 'genesis-custom-blocks' ),
					'<strong>' . esc_html( $title ) . '</strong>'
				)
			)
		);
	}

	/**
	 * Render the currently importing block title.
	 *
	 * @param string $title The title of the block.
	 * @param string $error The error being reported.
	 */
	public function render_import_error( $title, $error ) {
		echo wp_kses_post(
			sprintf( '<p><strong>%s</strong></p><p>%s</p>', $title, $error )
		);
	}

	/**
	 * Render the successful import message.
	 */
	public function render_done() {
		?>
		<p><?php esc_html_e( 'All done!', 'genesis-custom-blocks' ); ?></p>
		<?php
	}

	/**
	 * Render the interface for choosing blocks to update.
	 *
	 * @param array $blocks An array of block names to choose from.
	 */
	public function render_choose_blocks( $blocks ) {
		?>
		<p><?php esc_html_e( 'Please select the blocks to import:', 'genesis-custom-blocks' ); ?></p>
		<form>
			<?php
			foreach ( $blocks as $block_namespace => $block ) {
				$action = __( 'Import', 'genesis-custom-blocks' );
				if ( $this->block_exists( $block_namespace ) ) {
					$action = __( 'Replace', 'genesis-custom-blocks' );
				}
				?>
				<p>
					<input type="checkbox" name="<?php echo esc_attr( $block_namespace ); ?>" id="<?php echo esc_attr( $block_namespace ); ?>" checked>
					<label for="<?php echo esc_attr( $block_namespace ); ?>">
						<?php echo esc_html( $action ); ?> <strong><?php echo esc_attr( $block['title'] ); ?></strong>
					</label>
				</p>
				<?php
			}
			wp_nonce_field();
			?>
			<input type="hidden" name="import" value="genesis-custom-blocks">
			<input type="hidden" name="step" value="2">
			<p class="submit"><input type="submit" value="<?php esc_attr_e( 'Import Selected', 'genesis-custom-blocks' ); ?>" class="button button-primary"></p>
		</form>
		<?php
	}

	/**
	 * Handles the JSON upload and initial parsing of the file.
	 *
	 * @param array $file The file.
	 * @return bool False if error uploading or invalid file, true otherwise.
	 */
	public function validate_upload( $file ) {
		if ( isset( $file['error'] ) ) {
			$this->render_import_error(
				__( 'Sorry, there was an error uploading the file.', 'genesis-custom-blocks' ),
				$file['error']
			);
			return false;
		} elseif ( ! file_exists( $file['file'] ) ) {
			$this->render_import_error(
				__( 'Sorry, there was an error uploading the file.', 'genesis-custom-blocks' ),
				sprintf(
					// translators: placeholder refers to a file directory.
					__( 'The export file could not be found at %1$s. It is likely that this was caused by a permissions problem.', 'genesis-custom-blocks' ),
					'<code>' . esc_html( $file['file'] ) . '</code>'
				)
			);
			return false;
		}

		// This is on the local filesystem, so file_get_contents() is ok to use here.
		$json = file_get_contents( $file['file'] ); // @codingStandardsIgnoreLine
		$data = json_decode( $json, true );

		if ( ! is_array( $data ) ) {
			$this->render_import_error(
				__( 'Sorry, there was an error processing the file.', 'genesis-custom-blocks' ),
				__( 'Invalid JSON.', 'genesis-custom-blocks' )
			);
			return false;
		}

		return true;
	}

	/**
	 * Import data into new Genesis Custom Blocks posts.
	 *
	 * @param array $blocks An array of Genesis Custom Blocks content blocks.
	 */
	public function import_blocks( $blocks ) {
		foreach ( $blocks as $block_namespace => $block ) {
			if ( ! isset( $block['title'] ) || ! isset( $block['name'] ) ) {
				continue;
			}

			$post_id = false;

			if ( $this->block_exists( $block_namespace ) ) {
				$post = get_page_by_path( $block['name'], OBJECT, genesis_custom_blocks()->get_post_type_slug() );
				if ( $post ) {
					$post_id = $post->ID;
				}
			}

			$json = wp_json_encode( [ $block_namespace => $block ], JSON_UNESCAPED_UNICODE );

			$post_data = [
				'post_title'   => $block['title'],
				'post_name'    => $block['name'],
				'post_content' => wp_slash( $json ),
				'post_status'  => 'publish',
				'post_type'    => genesis_custom_blocks()->get_post_type_slug(),
			];

			if ( $post_id ) {
				$post_data['ID'] = $post_id;
			}
			$post = wp_insert_post( $post_data );

			if ( is_wp_error( $post ) ) {
				$this->render_import_error(
					sprintf(
						// translators: placeholder refers to title of custom block.
						__( 'Error importing %s.', 'genesis-custom-blocks' ),
						$block['title']
					),
					$post->get_error_message()
				);
			} else {
				$this->render_import_success( $block['title'] );
			}
		}

		$this->render_done();
	}

	/**
	 * Check if block already exists.
	 *
	 * @param string $block_namespace The JSON key for the block. e.g. genesis-custom-blocks/foo.
	 *
	 * @return bool
	 */
	private function block_exists( $block_namespace ) {
		return in_array( $block_namespace, get_dynamic_block_names(), true );
	}
}
