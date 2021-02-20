<?php
/**
 * Tests for class Number.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Number;
use Genesis\CustomBlocks\Blocks\Controls\ControlSetting;

/**
 * Tests for class Number.
 */
class TestNumber extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Number.
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
	public function setUp() {
		parent::setUp();
		$this->instance = new Number();
		$this->setting  = new ControlSetting();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Number::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Number', $this->instance->label );
		$this->assertEquals( 'number', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * The parent constructor calls register_settings(), so there's no need to call it again here.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Number::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
			[
				'name'    => 'location',
				'label'   => 'Field Location',
				'type'    => 'location',
				'default' => 'editor',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'width',
				'label'   => 'Field Width',
				'type'    => 'width',
				'default' => '100',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'help',
				'label'   => 'Help Text',
				'type'    => 'text',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'default',
				'label'   => 'Default Value',
				'type'    => 'number',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'placeholder',
				'label'   => 'Placeholder Text',
				'type'    => 'text',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
