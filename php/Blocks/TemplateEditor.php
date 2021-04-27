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
		echo $markup; // phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
