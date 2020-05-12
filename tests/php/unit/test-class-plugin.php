<?php
/**
 * Tests for class Plugin.
 *
 * @package GenesisCustomBlocks
 */

/**
 * Tests for class Plugin.
 */
class Test_Plugin extends \WP_UnitTestCase {

	use Testing_Helper;

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
		$this->instance = new GenesisCustomBlocks\Plugin();
		$this->instance->init();
		$this->instance->plugin_loaded();
	}

	/**
	 * Test init.
	 *
	 * @covers \GenesisCustomBlocks\Plugin::init()
	 */
	public function test_init() {
		$plugin_instance = new GenesisCustomBlocks\Plugin();
		$plugin_instance->init();
		$plugin_instance->plugin_loaded();

		$reflection_plugin = new ReflectionObject( $this->instance );
		$util_property     = $reflection_plugin->getProperty( 'util' );

		$util_property->setAccessible( true );
		$util_class = $util_property->getValue( $this->instance );

		$this->assertEquals( 'GenesisCustomBlocks\Util', get_class( $util_class ) );
	}

	/**
	 * Test plugin_loaded.
	 *
	 * @covers \GenesisCustomBlocks\Plugin::plugin_loaded()
	 */
	public function test_plugin_loaded() {
		$this->instance->plugin_loaded();
		$this->assertEquals( 'GenesisCustomBlocks\Admin\Admin', get_class( $this->instance->admin ) );
	}

	/**
	 * Test is_pro.
	 *
	 * This is essentially the same test as in Test_Util.
	 * But this tests that the __call() magic method in Plugin works.
	 * This method, is_pro(), is called in the Plugin class.
	 * So this ensures that the magic method refers the call to the Util class.
	 *
	 * @covers \GenesisCustomBlocks\Util::is_pro()
	 */
	public function test_is_pro() {
		$this->instance->admin = new GenesisCustomBlocks\Admin\Admin();
		$this->instance->admin->init();
		$this->set_license_validity( true );
		$this->assertTrue( $this->instance->is_pro() );

		$this->set_license_validity( false );
		$this->assertFalse( $this->instance->is_pro() );
	}

	/**
	 * Test get_template_locations.
	 *
	 * This is also essentially the same test as in Test_Util.
	 * But this also tests that the __call() magic method in Plugin works.
	 *
	 * @covers \GenesisCustomBlocks\Util::get_template_locations()
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
