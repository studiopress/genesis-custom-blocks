<?php
/**
 * Tests for class EditBlock.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\EditBlock;

/**
 * Tests for class EditBlock.
 */
class TestEditBlock extends AbstractTemplate {

	/**
	 * Instance of EditBlock.
	 *
	 * @var EditBlock
	 */
	public $instance;

	/**
	 * Sets up each test.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new EditBlock();
		$this->instance->set_plugin( genesis_custom_blocks() );
	}

	/**
	 * Tears down after each test.
	 *
	 * @inheritDoc
	 */
	public function tearDown() {
		unset( $GLOBALS['current_screen'] );
		parent::tearDown();
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertEquals( 10, has_filter( 'replace_editor', [ $this->instance, 'should_replace_editor' ] ) );
		$this->assertEquals( 10, has_filter( 'use_block_editor_for_post_type', [ $this->instance, 'should_use_block_editor_for_post_type' ] ) );
		$this->assertEquals( 10, has_action( 'admin_footer', [ $this->instance, 'enqueue_assets' ] ) );
	}

	/**
	 * Test should_replace_editor on the wrong page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::should_replace_editor()
	 */
	public function test_should_replace_editor_wrong_page() {
		$post = $this->factory()->post->create_and_get();
		$this->assertFalse( $this->instance->should_replace_editor( false, $post ) );
	}

	/**
	 * Test should_replace_editor on the correct page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::should_replace_editor()
	 */
	public function test_should_replace_editor_correct_page() {
		$correct_post_type = 'genesis_custom_block';
		$post              = $this->factory()->post->create_and_get(
			[ 'post_type' => $correct_post_type ]
		);

		$this->assertTrue( $this->instance->should_replace_editor( false, $post ) );
	}

	/**
	 * Test enqueue_assets on the wrong page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::enqueue_assets()
	 */
	public function test_enqueue_assets_wrong_page() {
		set_current_screen( 'front' );
		$this->instance->enqueue_assets();
		$this->assertFalse( wp_script_is( EditBlock::SCRIPT_SLUG ) );
	}


	/**
	 * Test enqueue_assets on the correct page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::enqueue_assets()
	 */
	public function test_enqueue_assets_correct_page() {
		set_current_screen( 'edit-post' );
		$wp_screen            = get_current_screen();
		$wp_screen->base      = 'post';
		$wp_screen->post_type = 'genesis_custom_block';
		$this->instance->enqueue_assets();

		$this->assertTrue( wp_script_is( EditBlock::SCRIPT_SLUG ) );
		$this->assertTrue( wp_style_is( EditBlock::STYLE_SLUG ) );
		$this->assertTrue( wp_style_is( EditBlock::TAILWIND_SLUG ) );
	}
}
