<?php
/**
 * Tests for class BlockPost.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\PostTypes\BlockPost;
use Genesis\CustomBlocks\Blocks\Controls\Textarea;

/**
 * Tests for class BlockPost.
 */
class TestBlockPost extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of BlockPost.
	 *
	 * @var BlockPost
	 */
	public $instance;

	/**
	 * The expected slug.
	 *
	 * @var string
	 */
	const EXPECTED_SLUG = 'genesis_custom_block';

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new BlockPost();
		$this->instance->register_controls();
		$this->instance->controls['textarea'] = new Textarea();
		$this->instance->set_plugin( genesis_custom_blocks() );
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\PostTypes\BlockPost::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals( 10, has_action( 'init', [ $this->instance, 'register_post_type' ] ) );
		$this->assertEquals( 10, has_action( 'plugins_loaded', [ $this->instance, 'add_caps' ] ) );
		$this->assertEquals( 10, has_action( 'edit_form_before_permalink', [ $this->instance, 'template_location' ] ) );

		$this->assertEquals( 10, has_action( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_scripts' ] ) );
		$this->assertEquals( 10, has_action( 'init', [ $this->instance, 'register_controls' ] ) );
		$this->assertEquals( 10, has_action( 'genesis_custom_blocks_field_value', [ $this->instance, 'get_field_value' ] ) );

		$this->assertEquals( 10, has_action( 'disable_months_dropdown', '__return_true' ) );
		$this->assertEquals( 10, has_action( 'page_row_actions', [ $this->instance, 'page_row_actions' ] ) );
		$this->assertEquals( 10, has_action( 'bulk_actions-edit-' . self::EXPECTED_SLUG, [ $this->instance, 'bulk_actions' ] ) );
		$this->assertEquals( 10, has_action( 'manage_edit-' . self::EXPECTED_SLUG . '_columns', [ $this->instance, 'list_table_columns' ] ) );
		$this->assertEquals( 10, has_action( 'manage_' . self::EXPECTED_SLUG . '_posts_custom_column', [ $this->instance, 'list_table_content' ] ) );
	}

	/**
	 * Test register_controls.
	 *
	 * @covers \Genesis\CustomBlocks\PostTypes\BlockPost::register_controls()
	 */
	public function test_register_controls() {
		$this->instance->register_controls();
		foreach ( $this->instance->controls as $control_type => $instance ) {
			$this->assertContains( 'Genesis\CustomBlocks\Blocks\Controls\\', get_class( $instance ) );
		}
	}

	/**
	 * Test get_control.
	 *
	 * @covers \Genesis\CustomBlocks\PostTypes\BlockPost::get_control()
	 */
	public function test_get_control() {
		$namespace = 'Genesis\CustomBlocks\Blocks\Controls\\';
		$this->assertEquals( $namespace . 'Textarea', get_class( $this->instance->get_control( 'textarea' ) ) );

		// If the control doesn't exist, this should return null.
		$this->assertEquals( null, $this->instance->get_control( 'non-existent-control' ) );
	}

	/**
	 * Test get_controls.
	 *
	 * @covers \Genesis\CustomBlocks\PostTypes\BlockPost::get_controls()
	 * @covers \Genesis\CustomBlocks\PostTypes\BlockPost::register_controls()
	 */
	public function test_get_controls() {
		$this->instance->register_controls();
		$this->assertEquals(
			[
				'text',
				'textarea',
				'url',
				'email',
				'number',
				'color',
				'image',
				'inner_blocks',
				'select',
				'multiselect',
				'toggle',
				'range',
				'checkbox',
				'radio',
			],
			array_keys( $this->instance->get_controls() )
		);
	}

	/**
	 * Test get_field_value.
	 *
	 * @covers \Genesis\CustomBlocks\PostTypes\BlockPost::get_field_value()
	 */
	public function test_get_field_value() {
		$invalid_value   = 'asdfg';
		$control         = 'image';
		$image_file_name = 'baz.jpeg';

		$image_id = $this->factory()->attachment->create_object(
			$image_file_name,
			$this->factory()->post->create(),
			[ 'post_mime_type' => 'image/jpeg' ]
		);

		// The 'image' control.
		$this->assertEquals( false, $this->instance->get_field_value( $invalid_value, $control, false ) );
		$this->assertEquals( $image_id, $this->instance->get_field_value( $image_id, $control, false ) );
		$this->assertContains( $image_file_name, $this->instance->get_field_value( $image_id, $control, true ) );

		// Any value for the 2nd argument other than 'image' should return the passed $value unchanged.
		$this->assertEquals( $invalid_value, $this->instance->get_field_value( $invalid_value, 'different-control', false ) );
		$this->assertEquals( $image_id, $this->instance->get_field_value( $image_id, 'random-control', false ) );
		$this->assertEquals( $invalid_value, $this->instance->get_field_value( $invalid_value, 'some-other-control', true ) );
	}

	/**
	 * Test get_capabilities.
	 *
	 * @covers \Genesis\CustomBlocks\PostTypes\BlockPost::get_capabilities()
	 */
	public function test_get_capabilities() {
		$capabilities = $this->instance->get_capabilities();
		$this->assertEquals( 'genesis_custom_block_edit_block', $capabilities['edit_post'] );
	}

	/**
	 * Initialises a dummy block.
	 */
	public function load_dummy_block() {
		global $post;

		$block = $this->factory()->post->create(
			[
				'post_title' => 'Test Block',
				'post_type'  => self::EXPECTED_SLUG,
			]
		);

		$post = $block;
		setup_postdata( $block );
	}
}
