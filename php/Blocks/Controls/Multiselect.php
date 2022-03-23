<?php
/**
 * Select control.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

/**
 * Class Multiselect
 */
class Multiselect extends ControlAbstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'multiselect';

	/**
	 * Field variable type.
	 *
	 * @var string
	 */
	public $type = 'array';

	/**
	 * Select constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->label = __( 'Multi-Select', 'genesis-custom-blocks' );
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
				'name'    => 'options',
				'label'   => __( 'Choices', 'genesis-custom-blocks' ),
				'type'    => 'textarea_array',
				'default' => '',
				'help'    => '',
			]
		);
		$this->settings[] = new ControlSetting(
			[
				'name'    => 'default',
				'label'   => __( 'Default Value', 'genesis-custom-blocks' ),
				'type'    => 'textarea_default',
				'default' => [],
				'help'    => __( 'Each default value on a new line.', 'genesis-custom-blocks' ),
			]
		);
	}
}
