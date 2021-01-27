<?php
/**
 * Genesis Custom Blocks Pro upgrade page.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

$get_genesis_pro_url  = 'https://my.wpengine.com/signup?plan=genesis-pro';
$genesis_pro_info_url = 'https://www.studiopress.com/genesis-pro/';

?>
<section class="container">
	<div class="gcb-hero">
		<img src="<?php echo esc_url( genesis_custom_blocks()->get_assets_url( 'images/logo-reversed.svg' ) ); ?>" alt="<?php esc_html_e( 'Genesis Custom Blocks', 'genesis-custom-blocks' ); ?>" />
		<h3><?php esc_html_e( 'Advanced tools for building better WordPress websites faster.', 'genesis-custom-blocks' ); ?></h3>
		<div class="gcb-hero__actions">
			<a class="btn" href="<?php echo esc_url( $get_genesis_pro_url ); ?>"><?php esc_html_e( 'Get Genesis Pro', 'genesis-custom-blocks' ); ?></a>
		</div>
	</div>
	<div class="gcb-content-body">
		<div>
			<h2><?php esc_html_e( 'Advanced features for Genesis Custom Blocks', 'genesis-custom-blocks' ); ?></h2>
			<h3><?php esc_html_e( 'Powerful & Dynamic Fields', 'genesis-custom-blocks' ); ?></h3>
			<p><?php esc_html_e( 'Access additional fields for your custom blocks with Genesis Pro.', 'genesis-custom-blocks' ); ?></p>
			<div class="pro-fields">
				<div class="pro-field">
					<div class="pro-field--icon">
						<svg fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
								clip-rule="evenodd"
								></path>
						</svg>
					</div>
					<span><?php esc_html_e( 'Repeater field', 'genesis-custom-blocks' ); ?></span>
				</div>
				<div class="pro-field">
					<div class="pro-field--icon">
						<svg fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
								clip-rule="evenodd"
								></path>
						</svg>
					</div>
					<span><?php esc_html_e( 'Post field', 'genesis-custom-blocks' ); ?></span>
				</div>
				<div class="pro-field">
					<div class="pro-field--icon">
						<svg fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
								clip-rule="evenodd"
								></path>
						</svg>
					</div>
					<span><?php esc_html_e( 'Taxonomy field', 'genesis-custom-blocks' ); ?></span>
				</div>
				<div class="pro-field">
					<div class="pro-field--icon">
						<svg fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
								clip-rule="evenodd"
								></path>
						</svg>
					</div>
					<span><?php esc_html_e( 'User field', 'genesis-custom-blocks' ); ?></span>
				</div>
				<div class="pro-field">
					<div class="pro-field--icon">
						<svg fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
								clip-rule="evenodd"
								></path>
						</svg>
					</div>
					<span><?php esc_html_e( 'Rich Text field', 'genesis-custom-blocks' ); ?></span>
				</div>
				<div class="pro-field">
					<div class="pro-field--icon">
						<svg fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
								clip-rule="evenodd"
								></path>
						</svg>
					</div>
					<span><?php esc_html_e( 'Classic Text field', 'genesis-custom-blocks' ); ?></span>
				</div>
				<div class="pro-field pro-field--more">
					<span><?php esc_html_e( '+ more coming soon…', 'genesis-custom-blocks' ); ?></span>
				</div>
			</div>
			<h3><?php esc_html_e( 'Block Export & Import', 'genesis-custom-blocks' ); ?></h3>
			<p><?php esc_html_e( 'Export and import on a per-block basis and share your custom blocks between sites and projects.', 'genesis-custom-blocks' ); ?></p>
		</div>
		<div>
			<br />
			<h2><?php esc_html_e( 'Industry leading Support', 'genesis-custom-blocks' ); ?></h2>
			<p><?php esc_html_e( 'A Genesis Pro subscription gives you access to the incredible support teams that have been the Customer Experience foundation of WP Engine and StudioPress. You will be able to build with confidence knowing that you have extensive documentation and 24/7 support available.', 'genesis-custom-blocks' ); ?></p>
		</div>
		<div>
			<br />
			<h2><?php esc_html_e( 'Do even more with Genesis', 'genesis-custom-blocks' ); ?></h2>
			<p><?php esc_html_e( 'Genesis is more than just custom blocks. With Genesis Pro you get access to the entire suite of products and all their advanced feature-sets.', 'genesis-custom-blocks' ); ?></p>
		</div>
		<div class="gen-feature-table">
			<div class="gen-feature-table--col">
				<h3><?php esc_html_e( 'Free', 'genesis-custom-blocks' ); ?></h3>
				<ul>
					<li><?php esc_html_e( 'Genesis Blocks', 'genesis-custom-blocks' ); ?></li>
					<li><?php esc_html_e( 'Genesis Custom Blocks', 'genesis-custom-blocks' ); ?></li>
				</ul>
				<a class="btn btn-secondary" style="margin-top: auto;" href="<?php echo esc_url( $genesis_pro_info_url ); ?>"><?php esc_html_e( 'Learn more', 'genesis-custom-blocks' ); ?></a>
			</div>
			<div class="gen-feature-table--col">
				<h3><?php esc_html_e( 'Genesis Pro', 'genesis-custom-blocks' ); ?></h3>
				<ul>
					<li><em><?php esc_html_e( 'Everything in free!!!', 'genesis-custom-blocks' ); ?></em></li>
					<li><?php esc_html_e( 'Advanced Features for Genesis Blocks', 'genesis-custom-blocks' ); ?></li>
					<li><?php esc_html_e( 'Advanced Features for Genesis Custom Blocks', 'genesis-custom-blocks' ); ?></li>
					<li><?php esc_html_e( 'Genesis Framework', 'genesis-custom-blocks' ); ?></li>
					<li><?php esc_html_e( 'StudioPress Themes', 'genesis-custom-blocks' ); ?></li>
					<li><?php esc_html_e( '24/7 Support', 'genesis-custom-blocks' ); ?></li>
				</ul>
				<a class="btn" style="margin-top: auto;" href="<?php echo esc_url( $genesis_pro_info_url ); ?>"><?php esc_html_e( 'Learn more', 'genesis-custom-blocks' ); ?></a>
			</div>
		</div>
	</div>
</section>
