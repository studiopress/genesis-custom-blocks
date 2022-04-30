<?php
/**
 * Control abstract.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2022, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

use JsonSerializable;
use Genesis\CustomBlocks\Blocks\Field;

/**
 * Class ControlAbstract
 */
abstract class ControlAbstract implements JsonSerializable {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = '';

	/**
	 * Control label.
	 *
	 * @var string
	 */
	public $label = '';

	/**
	 * Field variable type (passed as an attribute when registering the block in Javascript).
	 *
	 * @var string
	 */
	public $type = 'string';

	/**
	 * Control settings.
	 *
	 * @var ControlSetting[]
	 */
	public $settings = [];

	/**
	 * Configurations for common settings, like 'help' and 'placeholder'.
	 *
	 * @var array {
	 *     An associative array of setting configurations.
	 *
	 *     @type string $setting_name   The name of the setting, like 'help'.
	 *     @type array  $setting_config The default configuration of the setting.
	 * }
	 */
	public $settings_config = [];

	/**
	 * The possible editor locations, either in the main block editor, or the inspector controls.
	 *
	 * @var array
	 */
	public $locations = [];

	/**
	 * Control constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->create_settings_config();
		$this->register_settings();
	}

	/**
	 * Creates the setting configuration.
	 *
	 * This sets the values for common settings, to make adding settings more DRY.
	 * Then, controls can simply use the values here.
	 *
	 * @return void
	 */
	public function create_settings_config() {
		$this->settings_config = [
			'location'    => [
				'name'    => 'location',
				'label'   => __( 'Field Location', 'genesis-custom-blocks' ),
				'type'    => 'location',
				'default' => 'editor',
			],
			'width'       => [
				'name'    => 'width',
				'label'   => __( 'Field Width', 'genesis-custom-blocks' ),
				'type'    => 'width',
				'default' => '100',
			],
			'help'        => [
				'name'    => 'help',
				'label'   => __( 'Help Text', 'genesis-custom-blocks' ),
				'type'    => 'text',
				'default' => '',
			],
			'default'     => [
				'name'    => 'default',
				'label'   => __( 'Default Value', 'genesis-custom-blocks' ),
				'type'    => 'text',
				'default' => '',
			],
			'placeholder' => [
				'name'    => 'placeholder',
				'label'   => __( 'Placeholder Text', 'genesis-custom-blocks' ),
				'type'    => 'text',
				'default' => '',
			],
		];

		$this->locations = [
			'editor'    => __( 'Editor', 'genesis-custom-blocks' ),
			'inspector' => __( 'Inspector', 'genesis-custom-blocks' ),
		];
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	abstract public function register_settings();

	/**
	 * Gets a JSON-serialized version of this object.
	 *
	 * @return mixed The JSON-serialized object.
	 */
	#[\ReturnTypeWillChange]
	public function jsonSerialize() {
		$object = clone( $this );
		unset( $object->settings_config );
		return get_object_vars( $object );
	}
}
