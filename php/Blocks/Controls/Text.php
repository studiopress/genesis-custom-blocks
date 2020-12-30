<?php
/**
 * Text control.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

/**
 * Class Text
 */
class Text extends ControlAbstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'text';

	/**
	 * Text constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->label = __( 'Text', 'genesis-custom-blocks' );
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		foreach ( [ 'location', 'width', 'help', 'default', 'placeholder' ] as $setting ) {
			$this->settings[] = new ControlSetting( $this->settings_config[ $setting ] );
		}

		$this->settings[] = new ControlSetting(
			[
				'name'     => 'maxlength',
				'label'    => __( 'Character Limit', 'genesis-custom-blocks' ),
				'type'     => 'number_non_negative',
				'default'  => '',
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
	}
}
