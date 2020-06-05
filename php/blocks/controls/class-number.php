<?php
/**
 * Number control.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

/**
 * Class Text
 */
class Number extends Control_Abstract {

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
		$this->settings[] = new Control_Setting( $this->settings_config['location'] );
		$this->settings[] = new Control_Setting( $this->settings_config['width'] );
		$this->settings[] = new Control_Setting( $this->settings_config['help'] );
		$this->settings[] = new Control_Setting(
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
		$this->settings[] = new Control_Setting( $this->settings_config['placeholder'] );
	}
}
