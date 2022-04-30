<?php
/**
 * Tests for class Url.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Url;

/**
 * Tests for class Url.
 */
class TestUrl extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Url.
	 *
	 * @var Url
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp(): void { // phpcs:ignore PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations.voidFound
		parent::setUp();
		$this->instance = new Url();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Url::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'URL', $this->instance->label );
		$this->assertEquals( 'url', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * The parent constructor calls register_settings(), so there's no need to call it again here.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Url::register_settings()
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
				'type'    => 'url',
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
