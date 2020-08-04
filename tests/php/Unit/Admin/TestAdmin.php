<?php
/**
 * Tests for class Admin.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\Admin;
use Brain\Monkey;

/**
 * Tests for class Admin.
 */
class TestAdmin extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Admin.
	 *
	 * @var Admin
	 */
	public $instance;

	/**
	 * The slug of the Pro page.
	 *
	 * @var string
	 */
	const PRO_PAGE = 'genesis-custom-blocks-pro';

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		Monkey\setUp();
		$this->instance = new Admin();
	}

	/**
	 * Teardown.
	 *
	 * @inheritdoc
	 */
	public function tearDown() {
		Monkey\tearDown();
		parent::tearDown();
	}

	/**
	 * Test init.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Admin::init()
	 */
	public function test_init() {
		$this->set_subscription_key_validity( false );
		$this->instance->init();
		$settings_class     = 'Genesis\CustomBlocks\Admin\Settings';
		$subscription_class = 'Genesis\CustomBlocks\Admin\Subscription';
		$this->assertEquals( $settings_class, get_class( $this->instance->settings ) );
		$this->assertEquals( $subscription_class, get_class( $this->instance->subscription ) );

		$reflection = new ReflectionObject( genesis_custom_blocks() );
		$components = $reflection->getProperty( 'components' );
		$components->setAccessible( true );
		$components_value = $components->getValue( genesis_custom_blocks() );

		// The settings should have been added to the plugin components.
		$this->assertEquals( $this->instance->settings->slug, $components_value[ $settings_class ]->slug );
		$this->assertArrayHasKey( $settings_class, $components_value );
		$this->assertArrayHasKey( $subscription_class, $components_value );
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Admin::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertEquals( 10, has_action( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_scripts' ] ) );
	}

	/**
	 * Test enqueue_scripts.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Admin::enqueue_scripts()
	 */
	public function test_enqueue_scripts() {
		genesis_custom_blocks()->register_component( $this->instance );
		$this->instance->set_plugin( genesis_custom_blocks() );
		$this->instance->enqueue_scripts();
		$styles     = wp_styles();
		$handle     = 'genesis-custom-blocks';
		$stylesheet = $styles->registered[ $handle ];

		$this->assertEquals( $handle, $stylesheet->handle );
		$this->assertContains( 'css/admin.css', $stylesheet->src );
		$this->assertEquals( [], $stylesheet->deps );
		$this->assertEquals( [], $stylesheet->extra );
		$this->assertTrue( in_array( $handle, $styles->queue, true ) );
	}

	/**
	 * Test maybe_settings_redirect.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Admin::maybe_settings_redirect()
	 */
	public function test_maybe_settings_redirect() {
		Monkey\Functions\expect( 'filter_input' )
			->once()
			->with(
				INPUT_GET,
				'page',
				FILTER_SANITIZE_STRING
			)
			->andReturn( 'incorrect-page' );

		// This is on the wrong page, so this should not redirect.
		$this->assertFalse( $this->did_settings_redirect_occur() );

		Monkey\Functions\expect( 'filter_input' )
			->twice()
			->with(
				INPUT_GET,
				'page',
				FILTER_SANITIZE_STRING
			)
			->andReturn( self::PRO_PAGE );

		// Now that this is on the correct page, the conditional should be true, and this should redirect.
		$this->assertTrue( $this->did_settings_redirect_occur() );

		// Mainly copied from Weston Ruter in the AMP Plugin for WordPress.
		add_filter(
			'wp_redirect',
			function( $url, $status ) {
				throw new Exception( $url, $status );
			},
			10,
			2
		);

		try {
			$this->instance->maybe_settings_redirect();
		} catch ( Exception $e ) {
			$exception = $e;
		}

		$expected_url = add_query_arg(
			[
				'post_type' => 'genesis_custom_block',
				'page'      => 'genesis-custom-blocks-settings',
				'tab'       => 'subscription',
			],
			admin_url( 'edit.php' )
		);

		// Assert that the response was a redirect (302), and that it redirected to the right URL.
		$this->assertTrue( isset( $exception ) && 302 === $exception->getCode() );
		$this->assertTrue( isset( $exception ) && $expected_url === $exception->getMessage() );
	}

	/**
	 * Invokes maybe_settings_redirect(), and gets whether the redirect occurred.
	 *
	 * @return boolean Whether it caused a redirect.
	 */
	public function did_settings_redirect_occur() {
		try {
			$this->instance->maybe_settings_redirect();
		} catch ( Exception $e ) {
			$exception = $e;
		}

		return isset( $exception );
	}
}
