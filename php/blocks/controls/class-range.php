<?php
/**
 * Range control.
 *
 * @package   GenesisCustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

/**
 * Class Range
 */
class Range extends Control_Abstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'range';

	/**
	 * Field variable type.
	 *
	 * @var string
	 */
	public $type = 'integer';

	/**
	 * Range constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->label = __( 'Range', 'genesis-custom-blocks' );
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
				'name'     => 'min',
				'label'    => __( 'Minimum Value', 'genesis-custom-blocks' ),
				'type'     => 'number',
				'default'  => '',
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
		$this->settings[] = new Control_Setting(
			[
				'name'     => 'max',
				'label'    => __( 'Maximum Value', 'genesis-custom-blocks' ),
				'type'     => 'number',
				'default'  => '',
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
		$this->settings[] = new Control_Setting(
			[
				'name'     => 'step',
				'label'    => __( 'Step Size', 'genesis-custom-blocks' ),
				'type'     => 'number_non_negative',
				'default'  => 1,
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
		$this->settings[] = new Control_Setting(
			[
				'name'     => 'default',
				'label'    => __( 'Default Value', 'genesis-custom-blocks' ),
				'type'     => 'number',
				'default'  => '',
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
	}
}
