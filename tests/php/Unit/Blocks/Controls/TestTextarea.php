<?php
/**
 * Tests for class Textarea.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Textarea;
use Genesis\CustomBlocks\Blocks\Controls\ControlSetting;

/**
 * Tests for class Textarea.
 */
class TestTextarea extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Textarea.
	 *
	 * @var Textarea
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
		$this->instance = new Textarea();
		$this->setting  = new ControlSetting();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Textarea::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Textarea', $this->instance->label );
		$this->assertEquals( 'textarea', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * The parent constructor calls register_settings(), so there's no need to call it again here.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Textarea::register_settings()
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
				'type'    => 'textarea',
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
			[
				'name'    => 'maxlength',
				'label'   => 'Character Limit',
				'type'    => 'number_non_negative',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'number_rows',
				'label'   => 'Number of Rows',
				'type'    => 'number_non_negative',
				'default' => 4,
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'new_lines',
				'label'   => 'New Lines',
				'type'    => 'new_line_format',
				'default' => 'autop',
				'help'    => '',
				'value'   => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}
}
