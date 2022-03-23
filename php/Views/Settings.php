<?php
/**
 * Genesis Custom Blocks Pro Settings page.
 *
 * @package   Genesis\CustomBlocksPro
 * @copyright Copyright(c) 2022, Genesis Custom Blocks Pro
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

use Genesis\CustomBlocks\Admin\Settings;

?>
<div class="wrap genesis-custom-blocks-settings">
	<h1><?php esc_html_e( 'Genesis Custom Blocks Settings', 'genesis-custom-blocks' ); ?></h1>
	<form method="post" action="options.php">
		<?php
		settings_fields( Settings::SETTINGS_GROUP );
		do_settings_sections( Settings::SETTINGS_GROUP );
		?>
		<table class="form-table">
			<tr valign="top">
				<th scope="row">
					<label for="<?php echo esc_attr( SETTINGS::ANALYTICS_OPTION_NAME ); ?>"><?php esc_html_e( 'Enable analytics', 'genesis-custom-blocks' ); ?></label>
				</th>
				<td>
					<input type="checkbox" value="<?php echo esc_attr( Settings::ANALYTICS_OPTED_IN_VALUE ); ?>" <?php echo checked( get_option( SETTINGS::ANALYTICS_OPTION_NAME ), Settings::ANALYTICS_OPTED_IN_VALUE ); ?> name="<?php echo esc_attr( Settings::ANALYTICS_OPTION_NAME ); ?>" id="<?php echo esc_attr( Settings::ANALYTICS_OPTION_NAME ); ?>" class="regular-text" />
				</td>
			</tr>
		</table>
		<?php

		/**
		 * Runs when rendering the page /wp-admin > Custom Blocks > Settings.
		 */
		do_action( 'genesis_custom_blocks_render_settings_page' );

		submit_button();
		?>
	</form>
</div>
