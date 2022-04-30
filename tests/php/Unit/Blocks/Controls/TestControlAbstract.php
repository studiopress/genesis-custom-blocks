<?php
/**
 * Tests for class ControlAbstract.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Number;
use Genesis\CustomBlocks\Blocks\Controls\ControlSetting;

/**
 * Tests for class ControlAbstract.
 */
class TestControlAbstract extends \WP_UnitTestCase {

	/**
	 * A mock name of the control.
	 *
	 * @var string
	 */
	const NAME = 'block-fields-settings[5c6c6bcf03d2c][default]';

	/**
	 * A mock ID of the control.
	 *
	 * @var string
	 */
	const ID = 'block-fields-edit-settings-number-default_5c6c6bcf03d2c';

	/**
	 * Instance of the extending class Number.
	 *
	 * @var Number
	 */
	public $instance;

	/**
	 * Instance of the setting.
	 *
	 * @var ControlSetting
	 */
	public $setting;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp(): void { // phpcs:ignore PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations.voidFound
		parent::setUp();
		$this->instance = new Number();
		$this->setting  = new ControlSetting();
	}

	/**
	 * Test create_settings_config.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::create_settings_config()
	 */
	public function test_create_settings_config() {
		$this->assertContainsEquals(
			[
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
			],
			$this->instance->settings_config
		);

		$this->assertContainsEquals(
			[
				'editor'    => __( 'Editor', 'genesis-custom-blocks' ),
				'inspector' => __( 'Inspector', 'genesis-custom-blocks' ),
			],
			$this->instance->locations
		);
	}
}
