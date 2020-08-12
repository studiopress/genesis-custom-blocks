<?php
/**
 * Tests for class Plugin.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Plugin;
use Genesis\CustomBlocks\Admin\Admin;

/**
 * Tests for class Plugin.
 */
class TestPlugin extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Plugin.
	 *
	 * @var Plugin
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new Plugin();
		$this->instance->init();
		$this->instance->plugin_loaded();
	}

	/**
	 * Test init.
	 *
	 * @covers \Genesis\CustomBlocks\Plugin::init()
	 */
	public function test_init() {
		$plugin_instance = new Plugin();
		$plugin_instance->init();
		$plugin_instance->plugin_loaded();

		$reflection_plugin = new ReflectionObject( $this->instance );
		$util_property     = $reflection_plugin->getProperty( 'util' );

		$util_property->setAccessible( true );
		$util_class = $util_property->getValue( $this->instance );

		$this->assertEquals( 'Genesis\CustomBlocks\Util', get_class( $util_class ) );
	}

	/**
	 * Test plugin_loaded.
	 *
	 * @covers \Genesis\CustomBlocks\Plugin::plugin_loaded()
	 */
	public function test_plugin_loaded() {
		$this->instance->plugin_loaded();
		$this->assertEquals( 'Genesis\CustomBlocks\Admin\Admin', get_class( $this->instance->admin ) );
	}

	/**
	 * Test require_deprecated.
	 *
	 * @covers \Genesis\CustomBlocks\Plugin::require_deprecated()
	 */
	public function test_require_deprecated() {
		$this->instance->require_deprecated();
		$this->assertTrue( function_exists( 'block_row' ) );
	}

	/**
	 * Test get_template_locations.
	 *
	 * This is also essentially the same test as in TestUtil.
	 * But this also tests that the __call() magic method in Plugin works.
	 *
	 * @covers \Genesis\CustomBlocks\Util::get_template_locations()
	 */
	public function test_get_template_locations() {
		$name = 'foo-baz';
		$this->assertEquals(
			[
				'blocks/foo-baz/block.php',
				'blocks/block-foo-baz.php',
				'blocks/block.php',
			],
			$this->instance->get_template_locations( $name )
		);
	}
}
