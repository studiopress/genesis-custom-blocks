<?php
/**
 * InnerBlocks control.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

/**
 * Class InnerBlocks
 */
class InnerBlocks extends ControlAbstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'inner_blocks';

	/**
	 * Text constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->label     = __( 'Inner Blocks', 'genesis-custom-blocks' );
		$this->locations = [ 'editor' => __( 'Editor', 'genesis-custom-blocks' ) ];
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		$this->settings[] = new ControlSetting( $this->settings_config['help'] );
	}

	/**
	 * Validates the value to be made available to the front-end template.
	 *
	 * @param string $value The value to either make available as a variable or echoed on the front-end template.
	 * @param bool   $is_echo Whether this value will be echoed.
	 * @return string The InnerBlocks.
	 */
	public function validate( $value, $is_echo ) {
		unset( $value, $is_echo );
		$content = genesis_custom_blocks()->loader->get_data( 'content' );

		return empty( $content )
			? urldecode( wp_strip_all_tags( filter_input( INPUT_GET, 'inner_blocks' ) ) )
			: $content;
	}
}
