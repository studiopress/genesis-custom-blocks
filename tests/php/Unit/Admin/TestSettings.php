<?php
/**
 * Tests for class Settings.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\Settings;
use function Brain\Monkey\setUp;
use function Brain\Monkey\tearDown;
use function Brain\Monkey\Functions\expect;

/**
 * Tests for class Settings.
 */
class TestSettings extends WP_UnitTestCase {

	/**
	 * Instance of Settings.
	 *
	 * @var Admin\Settings
	 */
	public $instance;

	/**
	 * The slug of the parent of the submenu.
	 *
	 * @var string
	 */
	const SUBMENU_PARENT_SLUG = 'edit.php?post_type=genesis_custom_block';

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function set_up() {
		parent::set_up();
		setUp();
		$this->instance = new Settings();
		$this->instance->set_plugin( genesis_custom_blocks() );
	}

	/**
	 * Teardown.
	 *
	 * @inheritdoc
	 */
	public function tear_down() {
		global $submenu;

		unset( $submenu[ self::SUBMENU_PARENT_SLUG ] );
		tearDown();
		parent::tear_down();
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocksPro\Admin\Settings::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertEquals( 10, has_action( 'admin_menu', [ $this->instance, 'add_submenu_pages' ] ) );
	}

	/**
	 * Test add_submenu_pages.
	 *
	 * @covers \Genesis\CustomBlocksPro\Admin\Settings::add_submenu_pages()
	 */
	public function test_add_submenu_pages() {
		global $submenu;

		$expected_submenu_settings = [
			'Settings',
			'manage_options',
			Settings::PAGE_SLUG,
			'Genesis Custom Blocks Settings',
		];

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'author' ] ) );
		$this->instance->add_submenu_pages();

		// Because the current user doesn't have 'manage_options' permissions, this shouldn't add the submenu.
		$this->assertFalse( isset( $submenu ) && array_key_exists( self::SUBMENU_PARENT_SLUG, $submenu ) );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->instance->add_submenu_pages();

		// Now that the user has 'manage_options' permissions, this should add the submenu.
		$this->assertEquals( [ $expected_submenu_settings ], $submenu[ self::SUBMENU_PARENT_SLUG ] );
	}
}
