<?php
/**
 * Tests for class InnerBlocks.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\InnerBlocks;

/**
 * Tests for class Text.
 */
class TestInnerBlocks extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of InnerBlocks.
	 *
	 * @var InnerBlocks
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new InnerBlocks();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\InnerBlocks::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Inner Blocks', $this->instance->label );
		$this->assertEquals( [ 'editor' => 'Editor' ], $this->instance->locations );
		$this->assertEquals( 'inner_blocks', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\InnerBlocks::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
			[
				'name'    => 'help',
				'label'   => 'Help Text',
				'type'    => 'text',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
