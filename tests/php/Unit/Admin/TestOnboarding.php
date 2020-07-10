<?php
/**
 * Tests for class Onboarding.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\Onboarding;

/**
 * Tests for class Onboarding.
 */
class TestOnboarding extends \WP_UnitTestCase {

	/**
	 * Instance of Onboarding.
	 *
	 * @var Onboarding
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new Onboarding();
		$this->instance->set_plugin( genesis_custom_blocks() );
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Onboarding::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertEquals( 10, has_action( 'current_screen', [ $this->instance, 'admin_notices' ] ) );
	}

	/**
	 * Test plugin_activation when onboarding is enabled.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Onboarding::plugin_activation()
	 */
	public function test_plugin_activation_onboarding_enabled() {
		$this->instance->plugin_activation();
		$this->assertInternalType( 'integer', get_option( 'genesis_custom_blocks_example_post_id' ) );
		$this->assertEquals( 'true', get_transient( 'genesis_custom_blocks_show_welcome' ) );
	}

	/**
	 * Test plugin_activation when onboarding is disabled.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Onboarding::plugin_activation()
	 */
	public function test_plugin_activation_onboarding_disabled() {
		$_REQUEST[ Onboarding::QUERY_VAR_DISABLE_ONBOARDING ]       = true;
		$_REQUEST[ Onboarding::NONCE_QUERY_VAR_DISABLE_ONBOARDING ] = wp_create_nonce( Onboarding::NONCE_ACTION_DISABLE_ONBOARDING );
		$this->instance->plugin_activation();

		$this->assertEmpty( get_option( 'genesis_custom_blocks_example_post_id' ) );
		$this->assertEmpty( get_transient( 'genesis_custom_blocks_show_welcome' ) );
	}
}
