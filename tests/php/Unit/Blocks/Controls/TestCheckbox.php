<?php
/**
 * Tests for class Checkbox.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls;
use Genesis\CustomBlocks\Blocks\Controls\Checkbox;

/**
 * Tests for class Checkbox.
 */
class TestCheckbox extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Checkbox.
	 *
	 * @var Controls\Checkbox
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Checkbox();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Checkbox::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Checkbox', $this->instance->label );
		$this->assertEquals( 'checkbox', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * The parent constructor calls register_settings(), so there's no need to call it again here.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Checkbox::register_settings()
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
				'name'     => 'default',
				'label'    => 'Default Value',
				'type'     => 'checkbox',
				'default'  => false,
				'help'     => '',
				'validate' => '',
				'value'    => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
