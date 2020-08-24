<?php
/**
 * Tests for class Upgrade.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\Upgrade;
use Brain\Monkey;

/**
 * Tests for class Upgrade.
 */
class TestUpgrade extends \WP_UnitTestCase {

	/**
	 * Instance of Upgrade.
	 *
	 * @var Upgrade
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
	public function setUp() {
		parent::setUp();
		Monkey\setUp();
		$this->instance = new Upgrade();
		$this->instance->set_plugin( genesis_custom_blocks() );

	}

	/**
	 * Teardown.
	 *
	 * @inheritdoc
	 */
	public function tearDown() {
		global $submenu;

		unset( $submenu[ self::SUBMENU_PARENT_SLUG ] );
		Monkey\tearDown();
		parent::tearDown();
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Upgrade::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertEquals( 10, has_action( 'admin_menu', [ $this->instance, 'add_submenu_pages' ] ) );
		$this->assertEquals( 10, has_action( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_scripts' ] ) );
	}

	/**
	 * Test enqueue_scripts when there is no pro nag.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Upgrade::enqueue_scripts()
	 */
	public function test_enqueue_scripts_no_pro_nag() {
		add_filter( 'genesis_custom_blocks_show_pro_nag', '__return_false' );
		$this->instance->enqueue_scripts();
		$styles = wp_styles();

		$this->assertFalse( in_array( $this->instance->slug, $styles->queue, true ) );
		$this->assertFalse( in_array( $this->instance->slug, $styles->registered, true ) );
	}

	/**
	 * Test enqueue_scripts.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Upgrade::enqueue_scripts()
	 */
	public function test_enqueue_scripts() {
		$this->instance->enqueue_scripts();
		$styles = wp_styles();

		// Because filter_input() should return nothing, the conditional should be false, and this shouldn't enqueue the script.
		$this->assertFalse( in_array( $this->instance->slug, $styles->queue, true ) );
		$this->assertFalse( in_array( $this->instance->slug, $styles->registered, true ) );

		Monkey\Functions\expect( 'filter_input' )
			->once()
			->with(
				INPUT_GET,
				'page',
				FILTER_SANITIZE_STRING
			)
			->andReturn( 'wrong-page' );

		$this->instance->enqueue_scripts();
		$styles = wp_styles();

		// Because filter_input() returns the wrong page, the conditional should again be false and this shouldn't enqueue the script.
		$this->assertFalse( in_array( $this->instance->slug, $styles->queue, true ) );
		$this->assertFalse( in_array( $this->instance->slug, $styles->registered, true ) );

		Monkey\Functions\expect( 'filter_input' )
			->once()
			->with(
				INPUT_GET,
				'page',
				FILTER_SANITIZE_STRING
			)
			->andReturn( $this->instance->slug );

		$this->instance->enqueue_scripts();
		$styles = wp_styles();
		$style  = $styles->registered[ $this->instance->slug ];

		// Now that filter_input() returns the correct page, the conditional should be true, and this should enqueue the script.
		$this->assertTrue( in_array( $this->instance->slug, $styles->queue, true ) );
		$this->assertEquals( $this->instance->slug, $style->handle );
		$this->assertContains( 'css/admin.upgrade.css', $style->src );
		$this->assertEquals( [], $style->deps );
		$this->assertEquals( [], $style->extra );
	}

	/**
	 * Test add_submenu_pages.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Upgrade::add_submenu_pages()
	 */
	public function test_add_submenu_pages() {
		global $submenu;

		$expected_submenu_settings = [
			'Genesis Pro',
			'manage_options',
			$this->instance->slug,
			'Genesis Custom Blocks Pro',
		];

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );
		$this->instance->add_submenu_pages();

		// Because the current user doesn't have 'manage_options' permissions, this shouldn't add the submenu.
		$this->assertFalse( isset( $submenu ) && array_key_exists( self::SUBMENU_PARENT_SLUG, $submenu ) );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->instance->add_submenu_pages();

		// Now that the user has 'manage_options' permissions, this should add the submenu.
		$this->assertEquals( [ $expected_submenu_settings ], $submenu[ self::SUBMENU_PARENT_SLUG ] );
	}

	/**
	 * Test render_page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Upgrade::render_page()
	 */
	public function test_render_page() {
		ob_start();
		$this->instance->render_page();
		$output = ob_get_clean();

		$this->assertContains( '<div class="wrap genesis-custom-blocks-pro">', $output );
		$this->assertContains( '<h2 class="screen-reader-text">', $output );
	}
}
