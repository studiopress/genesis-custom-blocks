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
	public function set_up() {
		parent::set_up();
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
				'name'    => 'options',
				'label'   => 'Choices',
				'type'    => 'textarea_array',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'default',
				'label'   => 'Default Value',
				'type'    => 'textarea_default',
				'default' => [],
				'help'    => 'Each default value on a new line.',
				'value'   => null,
			],
		];
		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
