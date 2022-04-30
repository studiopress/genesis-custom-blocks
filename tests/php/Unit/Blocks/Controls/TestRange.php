<?php
/**
 * Tests for class Range.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Range;

/**
 * Tests for class Range.
 */
class TestRange extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Range.
	 *
	 * @var Range
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Range();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Range::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Range', $this->instance->label );
		$this->assertEquals( 'range', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * The parent constructor calls register_settings(), so there's no need to call it again here.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Range::register_settings()
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
				'name'    => 'min',
				'label'   => 'Minimum Value',
				'type'    => 'number',
				'default' => 0,
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'max',
				'label'   => 'Maximum Value',
				'type'    => 'number',
				'default' => 100,
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'step',
				'label'   => 'Step Size',
				'type'    => 'number_non_negative',
				'default' => 1,
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
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
