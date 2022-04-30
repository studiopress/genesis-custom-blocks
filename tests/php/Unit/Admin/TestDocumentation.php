<?php
/**
 * Tests for class Documentation.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\Documentation;
use function Brain\Monkey\setup;
use function Brain\Monkey\tearDown;
use function Brain\Monkey\Functions\expect;

/**
 * Tests for class Documentation.
 */
class TestDocumentation extends \WP_UnitTestCase {

	/**
	 * Instance of Documentation.
	 *
	 * @var Admin\Documentation
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
		$this->instance = new Documentation();
		$this->instance->set_plugin( genesis_custom_blocks() );

	}

	/**
	 * Teardown.
	 *
	 * @inheritdoc
	 */
	public function tearDown(): void { // phpcs:ignore PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations.voidFound
		global $submenu;

		unset( $submenu[ self::SUBMENU_PARENT_SLUG ] );
		tearDown();
		parent::tearDown();
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Documentation::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertEquals( 10, has_action( 'admin_menu', [ $this->instance, 'add_submenu_page' ] ) );
		$this->assertEquals( 10, has_action( 'admin_init', [ $this->instance, 'maybe_redirect' ] ) );
		$this->assertEquals( 10, has_action( 'allowed_redirect_hosts', [ $this->instance, 'add_redirect_host' ] ) );
	}

	/**
	 * Test add_submenu_page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Documentation::add_submenu_page()
	 */
	public function test_add_submenu_page() {
		global $submenu;

		$expected_submenu = [
			'Documentation',
			'manage_options',
			$this->instance->slug,
			'Documentation',
		];

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'author' ] ) );
		$this->instance->add_submenu_page();

		// Because the current user doesn't have 'manage_options' permissions, this shouldn't add the submenu.
		$this->assertFalse( isset( $submenu ) && array_key_exists( self::SUBMENU_PARENT_SLUG, $submenu ) );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->instance->add_submenu_page();

		// Now that the user has 'manage_options' permissions, this should add the submenu.
		$this->assertEquals( [ $expected_submenu ], $submenu[ self::SUBMENU_PARENT_SLUG ] );
	}

	/**
	 * Test maybe_redirect_to_documentation when not on a page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Documentation::maybe_redirect()
	 */
	public function test_maybe_redirect_to_documentation_not_on_page() {
		$this->assertFalse( $this->was_there_a_redirect() );
	}

	/**
	 * Test maybe_redirect_to_documentation when it is on the wrong page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Documentation::maybe_redirect()
	 */
	public function test_maybe_redirect_to_documentation_wrong_page() {
		expect( 'filter_input' )
			->andReturn( 'genesis-custom-blocks-pro' );

		$this->assertFalse( $this->was_there_a_redirect() );
	}

	/**
	 * Test maybe_redirect_to_documentation when it should redirect.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Documentation::maybe_redirect()
	 */
	public function test_maybe_redirect_to_documentation_with_redirect() {
		expect( 'filter_input' )
			->andReturn( 'genesis-custom-blocks-documentation' );

		$this->assertTrue( $this->was_there_a_redirect() );
	}

	/**
	 * Test maybe_redirect_to_documentation when it should redirect.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Documentation::add_redirect_host()
	 */
	public function test_add_redirect_host() {
		$initial_host = 'blog.example.com';
		$this->assertEquals(
			[ $initial_host, 'developer.wpengine.com' ],
			$this->instance->add_redirect_host( [ $initial_host ] )
		);
	}

	/**
	 * Gets whether there was a redirect to the documentation URL.
	 *
	 * If there was a redirect, there should have been an error from headers already sent.
	 *
	 * @return bool Whether there was a redirect.
	 */
	public function was_there_a_redirect() {
		try {
			$this->instance->maybe_redirect();
		} catch ( Exception $e ) {
			$error = $e;
		}

		return isset( $error );
	}
}
