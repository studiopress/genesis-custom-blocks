<?php
/**
 * Genesis Custom Blocks Pro custom editor header.
 *
 * Forked from wp-admin/admin-header.php.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

global $title;

header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ) );
get_admin_page_title();
$stripped_title = wp_strip_all_tags( $title );

/* translators: Admin screen title. %s: Admin screen name. */
$admin_title = sprintf( __( '%s &#8212; WordPress', 'genesis-custom-blocks' ), $stripped_title );

/** This filter is documented in wp-admin/admin-header.php */
$admin_title = apply_filters( 'admin_title', $admin_title, $stripped_title );
_wp_admin_html_begin();
?>
<title><?php echo esc_html( $admin_title ); ?></title>
