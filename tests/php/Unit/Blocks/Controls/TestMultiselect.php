<?php
/**
 * Tests for class Multiselect.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Multiselect;

/**
 * Tests for class Multiselect.
 */
class TestMultiselect extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Multiselect.
	 *
	 * @var Multiselect
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new Multiselect();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Multiselect::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Multi-Select', $this->instance->label );
		$this->assertEquals( 'multiselect', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * The parent constructor calls register_settings(), so there's no need to call it again here.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Multiselect::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
			[
				'name'     => 'location',
				'label'    => 'Field Location',
				'type'     => 'location',
				'default'  => 'editor',
				'help'     => '',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'width',
				'label'    => 'Field Width',
				'type'     => 'width',
				'default'  => '100',
				'help'     => '',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'help',
				'label'    => 'Help Text',
				'type'     => 'text',
				'default'  => '',
				'help'     => '',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'options',
				'label'    => 'Choices',
				'type'     => 'textarea_array',
				'default'  => '',
				'help'     => 'Enter each choice on a new line. To specify the value and label separately, use this format:<br />foo : Foo<br />bar : Bar',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'default',
				'label'    => 'Default Value',
				'type'     => 'textarea_array',
				'default'  => '',
				'help'     => 'Enter each default value on a new line.',
				'validate' => [ $this->instance, 'validate_options' ],
				'value'    => null,
			],
		];
		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
