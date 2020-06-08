<?php
/**
 * Tests for class Repeater.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Repeater;

/**
 * Tests for class Repeater.
 */
class TestRepeater extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Repeater.
	 *
	 * @var Repeater
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
	public function setUp() {
		parent::setUp();
		$this->instance = new Repeater();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Repeater::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Repeater', $this->instance->label );
		$this->assertEquals( 'repeater', $this->instance->name );
		$this->assertEquals( 'object', $this->instance->type );
	}

	/**
	 * Test register_settings.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Repeater::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
			[
				'name'     => 'help',
				'label'    => 'Help Text',
				'type'     => 'text',
				'default'  => '',
				'help'     => '',
				'sanitize' => 'sanitize_text_field',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'min',
				'label'    => 'Minimum Rows',
				'type'     => 'number_non_negative',
				'default'  => '',
				'help'     => '',
				'sanitize' => [ $this->instance, 'sanitize_number' ],
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'max',
				'label'    => 'Maximum Rows',
				'type'     => 'number_non_negative',
				'default'  => '',
				'help'     => '',
				'sanitize' => [ $this->instance, 'sanitize_number' ],
				'validate' => '',
				'value'    => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
