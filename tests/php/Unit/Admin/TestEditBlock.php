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
		$this->assertEquals( 10, has_filter( 'admin_footer_text', [ $this->instance, 'conditionally_prevent_footer_text' ] ) );
		$this->assertEquals( 11, has_filter( 'update_footer', [ $this->instance, 'conditionally_prevent_update_text' ] ) );
		$this->assertEquals( 10, has_action( 'rest_api_init', [ $this->instance, 'register_route_template_file' ] ) );
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
		$this->set_is_gcb_editor();
		$this->instance->enqueue_assets();

		$this->assertTrue( wp_script_is( EditBlock::SCRIPT_SLUG ) );
		$this->assertTrue( wp_style_is( EditBlock::STYLE_SLUG ) );
	}

	/**
	 * Test conditionally_prevent_footer_text on a non-editor page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::conditionally_prevent_footer_text()
	 */
	public function test_conditionally_prevent_footer_text_wrong_page() {
		set_current_screen( 'edit-post' );
		$wp_screen            = get_current_screen();
		$wp_screen->base      = 'post';
		$wp_screen->post_type = 'wrong_custom_post_type';
		$initial_footer_text  = 'Thank you for creating with WordPress';

		$this->assertEquals( $initial_footer_text, $this->instance->conditionally_prevent_footer_text( $initial_footer_text ) );
	}

	/**
	 * Test conditionally_prevent_footer_text on a GCB editor page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::conditionally_prevent_footer_text()
	 */
	public function test_conditionally_prevent_footer_text_correct_page() {
		$this->set_is_gcb_editor();
		$this->assertEquals( '', $this->instance->conditionally_prevent_footer_text( 'Thank you for creating with WordPress' ) );
	}

	/**
	 * Test conditionally_prevent_update_text on a non-editor page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::conditionally_prevent_update_text()
	 */
	public function test_conditionally_prevent_update_text_wrong_page() {
		set_current_screen( 'plugins' );
		$initial_update_text = 'Please update WordPress';
		$this->assertEquals( $initial_update_text, $this->instance->conditionally_prevent_update_text( $initial_update_text ) );
	}

	/**
	 * Test conditionally_prevent_update_text on a GCB editor page.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\EditBlock::conditionally_prevent_update_text()
	 */
	public function test_conditionally_prevent_update_text_correct_page() {
		$this->set_is_gcb_editor();
		$this->assertEquals( '', $this->instance->conditionally_prevent_update_text( 'Please update WordPress' ) );
	}

	/**
	 * Test register_route_template_file.
	 *
	 * @covers Genesis\CustomBlocks\Admin\EditBlock::register_route_template_file()
	 */
	public function test_register_route_template_file() {
		do_action( 'rest_api_init' );
		$this->instance->register_route_template_file();

		$this->assertArrayHasKey( '/genesis-custom-blocks/template-file', rest_get_server()->get_routes() );
	}

	/**
	 * Test get_template_file response no block name.
	 *
	 * @covers Genesis\CustomBlocks\Admin\EditBlock::get_template_file_response()
	 */
	public function test_get_template_file_response_no_block_name() {
		$response = $this->instance->get_template_file_response( [] );

		$this->assertEquals(
			'Please pass a block name',
			$response->get_error_message()
		);
	}

	/**
	 * Test get_template_file response.
	 *
	 * @covers Genesis\CustomBlocks\Admin\EditBlock::get_template_file_response()
	 */
	public function test_get_template_file_response() {
		$block_name = 'baz-example';
		$response   = $this->instance->get_template_file_response( [ 'blockName' => $block_name ] );

		$this->assertFalse( $response->get_data()['templateExists'] );
		$this->assertEquals(
			1,
			preg_match(
				"#blocks/block-{$block_name}\.php$#",
				$response->get_data()['templatePath']
			)
		);
	}

	/**
	 * Sets the current page to be the GCB editor.
	 */
	public function set_is_gcb_editor() {
		set_current_screen( 'edit-post' );
		$wp_screen            = get_current_screen();
		$wp_screen->base      = 'post';
		$wp_screen->post_type = 'genesis_custom_block';
	}
}
