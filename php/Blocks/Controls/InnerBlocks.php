<?php
/**
 * InnerBlocks control.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
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
	 * @param bool   $echo Whether this value will be echoed.
	 * @return string The InnerBlocks.
	 */
	public function validate( $value, $echo ) {
		unset( $value, $echo );
		return genesis_custom_blocks()->loader->get_data( 'content' );
	}
}
