<?php
/**
 * Genesis Custom Blocks settings form for the Subscription tab.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

use Genesis\CustomBlocks\Admin\Subscription;

?>
<form method="post" action="options.php">
	<?php
	settings_fields( Subscription::SUBSCRIPTION_KEY_SETTINGS_GROUP );
	do_settings_sections( Subscription::SUBSCRIPTION_KEY_SETTINGS_GROUP );

	if ( genesis_custom_blocks()->is_pro() ) {
		printf(
			'<p>%1$s</p>',
			esc_html__( 'Your Genesis Pro subscription key is valid.', 'genesis-custom-blocks' )
		);
	} else {
		printf(
			'<p>%1$s %2$s</p>',
			esc_html__( 'No Genesis Pro subscription key was found for this installation.', 'genesis-custom-blocks' ),
			sprintf(
				// translators: Opening and closing anchor and emphasis tags.
				esc_html__( '%1$sGet Genesis Pro!%2$s', 'genesis-custom-blocks' ),
				'<a href="https://wpengine.com/genesis-pro/"><em>',
				'</em></a>'
			)
		);
	}

	?>
	<table class="form-table">
		<tr valign="top">
			<th scope="row">
				<label for="<?php echo esc_attr( Subscription::SUBSCRIPTION_KEY_OPTION_NAME ); ?>"><?php esc_html_e( 'Subscription key', 'genesis-custom-blocks' ); ?></label>
			</th>
			<td>
				<input type="password" name="<?php echo esc_attr( Subscription::SUBSCRIPTION_KEY_OPTION_NAME ); ?>" id="<?php echo esc_attr( Subscription::SUBSCRIPTION_KEY_OPTION_NAME ); ?>" class="regular-text" value="<?php echo esc_attr( get_option( Subscription::SUBSCRIPTION_KEY_OPTION_NAME ) ); ?>" />
			</td>
		</tr>
	</table>
	<?php submit_button(); ?>
</form>
