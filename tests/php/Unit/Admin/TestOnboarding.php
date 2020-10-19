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
	 * Test show_welcome_notice when it should not display.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Onboarding::show_welcome_notice()
	 */
	public function test_show_welcome_notice_does_not_display() {
		ob_start();
		$this->instance->show_welcome_notice();
		$this->assertEmpty( ob_get_clean() );
	}

	/**
	 * Test show_welcome_notice when it should display.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Onboarding::show_welcome_notice()
	 */
	public function test_show_welcome_notice_should_display() {
		$post_id = $this->factory()->post->create( [ 'post_type' => 'genesis_custom_block' ] );
		update_option(
			Onboarding::OPTION_NAME,
			$post_id
		);

		ob_start();
		$this->instance->show_welcome_notice();

		$this->assertContains(
			'<div class="genesis-custom-blocks-welcome genesis-custom-blocks-notice notice is-dismissible">',
			ob_get_clean()
		);
	}

	/**
	 * Test plugin_activation.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Onboarding::plugin_activation()
	 */
	public function test_plugin_activation() {
		$this->instance->plugin_activation();
		$this->assertInternalType( 'integer', get_option( 'genesis_custom_blocks_example_post_id' ) );
		$this->assertEquals( 'true', get_transient( 'genesis_custom_blocks_show_welcome' ) );
	}
}
