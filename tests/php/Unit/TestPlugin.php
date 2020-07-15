<?php
/**
 * Tests for class Plugin.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Plugin;
use Genesis\CustomBlocks\Admin\Admin;
use function Brain\Monkey\Functions\expect;
use function Brain\Monkey\setUp;
use function Brain\Monkey\tearDown;

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
	 * @throws ReflectionException For a non-accessible property.
	 */
	public function setUp() {
		parent::setUp();
		setUp();
		$this->instance = new Plugin();
		$this->set_protected_property( 'is_conflict', false );
		$this->instance->init();
		$this->instance->plugin_loaded();
	}

	/**
	 * Teardown.
	 *
	 * @inheritdoc
	 */
	public function tearDown() {
		tearDown();
		parent::tearDown();
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
	 * Test is_pro.
	 *
	 * This is essentially the same test as in TestUtil.
	 * But this tests that the __call() magic method in Plugin works.
	 * This method, is_pro(), is called in the Plugin class.
	 * So this ensures that the magic method refers the call to the Util class.
	 *
	 * @covers \Genesis\CustomBlocks\Util::is_pro()
	 */
	public function test_is_pro() {
		$this->instance->admin = new Admin();
		$this->instance->admin->init();
		$this->set_subscription_key_validity( true );
		$this->assertTrue( $this->instance->is_pro() );

		$this->set_subscription_key_validity( false );
		$this->assertFalse( $this->instance->is_pro() );
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

	/**
	 * Gets the test data for test_is_plugin_conflict_true.
	 *
	 * @return array The test data.
	 */
	public function get_data_is_conflict() {
		return [
			'no_conflict' => [ false, false ],
			'conflict'    => [ true, true ],
		];
	}

	/**
	 * Test is_plugin_conflict when it's expected to be true.
	 *
	 * @dataProvider get_data_is_conflict
	 * @covers \Genesis\CustomBlocks\Util::get_template_locations()
	 *
	 * @param bool $function_exists Whether the function exists.
	 * @param bool $expected        The expected return value.
	 * @throws ReflectionException  For a non-accessible property.
	 */
	public function test_is_plugin_conflict_true( $function_exists, $expected ) {
		$this->set_protected_property( 'is_conflict', null );
		expect( 'function_exists' )
			->andReturn( $function_exists );

		// This should return the cached value, without needing to call function_exists() again.
		$this->assertEquals( $expected, $this->instance->is_plugin_conflict() );
	}

	/**
	 * Test plugin_conflict_notice.
	 *
	 * @covers \Genesis\CustomBlocks\Util::plugin_conflict_notice()
	 */
	public function test_plugin_conflict_notice() {
		ob_start();
		$this->instance->plugin_conflict_notice();
		$this->assertEquals(
			'<div class="notice notice-error"><p>It looks like Block Lab is active. Please deactivate it, as Genesis Custom Blocks will not work while it is active.</p></div>',
			ob_get_clean()
		);
	}
}
