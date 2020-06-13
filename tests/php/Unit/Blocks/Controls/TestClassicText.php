<?php
/**
 * Tests for class ClassicText.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\ClassicText;

/**
 * Tests for class ClassicText.
 */
class TestClassicText extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of ClassicText.
	 *
	 * @var ClassicText
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new ClassicText();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ClassicText::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Classic Text', $this->instance->label );
		$this->assertEquals( 'classic_text', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ClassicText::register_settings()
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
				'name'     => 'default',
				'label'    => 'Default Value',
				'type'     => 'text',
				'default'  => '',
				'help'     => '',
				'sanitize' => 'sanitize_text_field',
				'validate' => '',
				'value'    => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
