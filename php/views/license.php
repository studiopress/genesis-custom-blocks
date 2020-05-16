<?php
/**
 * Genesis Custom Blocks settings form for the License tab.
 *
 * @package   GenesisCustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

use GenesisCustomBlocks\Admin\License;

?>
<form method="post" action="options.php">
	<?php
	settings_fields( 'genesis-custom-blocks-license-key' );
	do_settings_sections( 'genesis-custom-blocks-license-key' );
	?>
	<table class="form-table">
		<tr valign="top">
			<th scope="row">
				<label><?php esc_html_e( 'License', 'genesis-custom-blocks' ); ?></label>
			</th>
			<td>
				<?php
				if ( genesis_custom_blocks()->is_pro() ) {
					$license = genesis_custom_blocks()->admin->license->get_license();

					$limit = __( 'unlimited', 'genesis-custom-blocks' );
					if ( isset( $license['license_limit'] ) && intval( $license['license_limit'] ) > 0 ) {
						$limit = $license['license_limit'];
					}

					$count = '0';
					if ( isset( $license['site_count'] ) ) {
						$count = $license['site_count'];
					}

					$expiry = gmdate( get_option( 'date_format' ) );
					if ( isset( $license['expires'] ) ) {
						$expiry = gmdate( get_option( 'date_format' ), strtotime( $license['expires'] ) );
					}

					echo wp_kses_post(
						sprintf(
							'<p>%1$s %2$s</p>',
							sprintf(
								// translators: A number, wrapped in <strong> tags.
								__( 'Your license includes %1$s site installs.', 'genesis-custom-blocks' ),
								'<strong>' . $limit . '</strong>'
							),
							sprintf(
								// translators: A number, wrapped in <strong> tags.
								__( '%1$s of them are in use.', 'genesis-custom-blocks' ),
								'<strong>' . $count . '</strong>'
							)
						)
					);

					echo wp_kses_post(
						sprintf(
							'<p>%1$s %2$s</p>',
							sprintf(
								// translators: A date.
								__( 'Your license expires on %1$s.', 'genesis-custom-blocks' ),
								'<strong>' . $expiry . '</strong>'
							),
							sprintf(
								// translators: An opening and closing anchor tag.
								__( '%1$sManage Licenses%2$s', 'genesis-custom-blocks' ),
								'<a href="https://getblocklab.com/checkout/purchase-history/" target="_blank">',
								'</a>'
							)
						)
					);
				} else {
					echo wp_kses_post(
						sprintf(
							'<p>%1$s %2$s</p>',
							__( 'No Pro license was found for this installation.', 'genesis-custom-blocks' ),
							sprintf(
								// translators: Opening and closing anchor and emphasis tags.
								__( '%1$sGet Genesis Custom Blocks Pro!%2$s', 'genesis-custom-blocks' ),
								'<a href="' . add_query_arg( [ 'page' => 'genesis-custom-blocks-pro' ] ) . '"><em>',
								'</em></a>'
							)
						)
					);
				}
				?>
			</td>
		</tr>
		<tr valign="top">
			<th scope="row">
				<label for="<?php echo esc_attr( License::OPTION_NAME ); ?>"><?php esc_html_e( 'License key', 'genesis-custom-blocks' ); ?></label>
			</th>
			<td>
				<input type="password" name="<?php echo esc_attr( License::OPTION_NAME ); ?>" id="<?php echo esc_attr( License::OPTION_NAME ); ?>" class="regular-text" value="<?php echo esc_attr( get_option( License::OPTION_NAME ) ); ?>" />
			</td>
		</tr>
	</table>
	<?php submit_button(); ?>
</form>
