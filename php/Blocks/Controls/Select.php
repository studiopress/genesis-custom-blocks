<?php
/**
 * Select control.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

/**
 * Class Select
 */
class Select extends ControlAbstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'select';

	/**
	 * Select constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->label = __( 'Select', 'genesis-custom-blocks' );
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
				'name'     => 'options',
				'label'    => __( 'Choices', 'genesis-custom-blocks' ),
				'type'     => 'textarea_array',
				'default'  => '',
				'help'     => sprintf(
					'%s %s<br />%s<br />%s',
					__( 'Enter each choice on a new line.', 'genesis-custom-blocks' ),
					__( 'To specify the value and label separately, use this format:', 'genesis-custom-blocks' ),
					_x( 'foo : Foo', 'Format for the menu values. option_value : Option Name', 'genesis-custom-blocks' ),
					_x( 'bar : Bar', 'Format for the menu values. option_value : Option Name', 'genesis-custom-blocks' )
				),
				'sanitize' => [ $this, 'sanitize_textarea_assoc_array' ],
			]
		);
		$this->settings[] = new ControlSetting(
			[
				'name'     => 'default',
				'label'    => __( 'Default Value', 'genesis-custom-blocks' ),
				'type'     => 'text',
				'default'  => '',
				'sanitize' => 'sanitize_text_field',
				'validate' => [ $this, 'validate_options' ],
			]
		);
	}
}
