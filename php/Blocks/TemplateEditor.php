<?php
/**
 * TemplateEditor.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks;

/**
 * Class TemplateEditor
 */
class TemplateEditor {

	/**
	 * Renders markup that was entered in the template editor.
	 *
	 * @param string $markup The markup to render.
	 */
	public function render( $markup ) {
		$rendered = preg_replace_callback(
			'#{{(\S+?)}}#',
			static function( $matches ) {
				ob_start();
				block_field( $matches[1] );
				return ob_get_clean();
			},
			$markup
		);

		// Escape characters before { should be stripped, like \{\{example\}\}.
		// Like if they have a tutorial on Mustache and need the template to render {{example}}.
		echo preg_replace( '#\\\{\\\{(\S+?)\\\}\\\}#', '{{\1}}', $rendered ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
