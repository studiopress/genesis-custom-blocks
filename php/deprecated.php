<?php
/**
 * Deprecated functions.
 *
 * Deprecated methods can also appear as functions here, with the format namespace__class__method().
 *
 * @see GenesisCustomBlocks\Component_Abstract->_call()
 *
 * @package   GenesisCustomBlocks
 * @copyright Copyright(c) 2018, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

/**
 * Show a PHP error to warn developers using deprecated functions.
 *
 * @param string $function    The function that was called.
 * @param string $version     The version of Genesis Custom Blocks that deprecated the function.
 * @param string $replacement The function that should have been called.
 */
function block_lab_deprecated_function( $function, $version, $replacement ) {
	_deprecated_function(
		// filter_var is used for sanitization here as it allows arrow functions ("->").
		filter_var(
			sprintf(
				// translators: A function name.
				__( 'Genesis Custom Blocks\'s %1$s', 'genesis-custom-blocks' ),
				$function
			),
			FILTER_SANITIZE_STRING
		),
		esc_html( $version ),
		filter_var( $replacement, FILTER_SANITIZE_STRING )
	);
}

/**
 * Handle the deprecated block_lab_get_icons() function.
 *
 * @see \GenesisCustomBlocks\Util->get_icons()
 *
 * @return array
 */
function block_lab_get_icons() {
	block_lab_deprecated_function( 'block_lab_get_icons', '1.3.5', 'block_lab()->get_icons()' );
	return block_lab()->get_icons();
}

/**
 * Handle the deprecated block_lab_allowed_svg_tags() function.
 *
 * @see \GenesisCustomBlocks\Util->allowed_svg_tags()
 *
 * @return array
 */
function block_lab_allowed_svg_tags() {
	block_lab_deprecated_function( 'block_lab_allowed_svg_tags', '1.3.5', 'block_lab()->allowed_svg_tags()' );
	return block_lab()->allowed_svg_tags();
}
