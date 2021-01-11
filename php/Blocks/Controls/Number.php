<?php
/**
 * Number control.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

/**
 * Class Number
 */
class Number extends ControlAbstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'number';

	/**
	 * Field variable type.
	 *
	 * @var string
	 */
	public $type = 'integer';

	/**
	 * Text constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->label = __( 'Number', 'genesis-custom-blocks' );
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		$this->settings[] = new ControlSetting( $this->settings_config['location'] );
		$this->settings[] = new ControlSetting( $this->settings_config['width'] );
		$this->settings[] = new ControlSetting( $this->settings_config['help'] );
		$this->settings[] = new ControlSetting(
			[
				'name'     => 'default',
				'label'    => __( 'Default Value', 'genesis-custom-blocks' ),
				'type'     => 'number',
				'default'  => '',
				'sanitize' => function ( $value ) {
					return filter_var( $value, FILTER_SANITIZE_NUMBER_INT );
				},
			]
		);
		$this->settings[] = new ControlSetting( $this->settings_config['placeholder'] );
	}
}
