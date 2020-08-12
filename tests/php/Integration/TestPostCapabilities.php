<?php
/**
 * TestPostCapabilities
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\PostTypes\BlockPost;

/**
 * Class TestPostCapabilities
 *
 * Tests the capabilities for the 'genesis_custom_block' post type.
 *
 * @package Genesis\CustomBlocks
 */
class TestPostCapabilities extends \WP_UnitTestCase {

	/**
	 * Instance of BlockPost.
	 *
	 * @var BlockPost
	 */
	public $block_post;

	/**
	 * The ID of the post.
	 *
	 * @var int
	 */
	public $post_id;

	/**
	 * The slug of the CPT.
	 *
	 * @var string
	 */
	public $post_type_slug = 'genesis_custom_block';

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->block_post = new BlockPost();
		$this->block_post->set_plugin( genesis_custom_blocks() );
		$this->block_post->register_post_type();
		$this->block_post->add_caps();
		$this->post_id = $this->factory()->post->create( [ 'post_type' => $this->post_type_slug ] );
	}

	/**
	 * Gets the users, capabilities, and the expected results.
	 *
	 * @return array[] The users, capabilities, and the expected results.
	 */
	public function get_users() {
		return [
			[ 'subscriber', 'genesis_custom_block_edit_block', false ],
			[ 'subscriber', 'genesis_custom_block_edit_blocks', false ],
			[ 'subscriber', 'genesis_custom_block_edit_others_blocks', false ],
			[ 'subscriber', 'genesis_custom_block_publish_blocks', false ],
			[ 'subscriber', 'genesis_custom_block_read_block', true ],
			[ 'subscriber', 'genesis_custom_block_read_private_blocks', false ],
			[ 'subscriber', 'genesis_custom_block_delete_block', false ],

			[ 'contributor', 'genesis_custom_block_edit_block', false ],
			[ 'contributor', 'genesis_custom_block_edit_blocks', false ],
			[ 'contributor', 'genesis_custom_block_edit_others_blocks', false ],
			[ 'contributor', 'genesis_custom_block_publish_blocks', false ],
			[ 'contributor', 'genesis_custom_block_read_block', true ],
			[ 'contributor', 'genesis_custom_block_read_private_blocks', false ],
			[ 'contributor', 'genesis_custom_block_delete_block', false ],

			[ 'author', 'genesis_custom_block_edit_block', false ],
			[ 'author', 'genesis_custom_block_edit_blocks', false ],
			[ 'author', 'genesis_custom_block_edit_others_blocks', false ],
			[ 'author', 'genesis_custom_block_publish_blocks', false ],
			[ 'author', 'genesis_custom_block_read_block', true ],
			[ 'author', 'genesis_custom_block_read_private_blocks', false ],
			[ 'author', 'genesis_custom_block_delete_block', false ],

			[ 'editor', 'genesis_custom_block_edit_block', false ],
			[ 'editor', 'genesis_custom_block_edit_blocks', false ],
			[ 'editor', 'genesis_custom_block_edit_others_blocks', false ],
			[ 'editor', 'genesis_custom_block_publish_blocks', false ],
			[ 'editor', 'genesis_custom_block_read_block', true ],
			[ 'editor', 'genesis_custom_block_read_private_blocks', false ],
			[ 'editor', 'genesis_custom_block_delete_block', true ],

			[ 'administrator', 'edit_post', true ],
			[ 'administrator', 'edit_posts', true ],
			[ 'administrator', 'edit_others_posts', true ],
			[ 'administrator', 'publish_posts', true ],
			[ 'administrator', 'read_post', true ],
			[ 'administrator', 'read_private_posts', true ],
			[ 'administrator', 'delete_post', true ],

			[ 'administrator', 'genesis_custom_block_edit_block', true ],
			[ 'administrator', 'genesis_custom_block_edit_blocks', true ],
			[ 'administrator', 'genesis_custom_block_edit_others_blocks', true ],
			[ 'administrator', 'genesis_custom_block_publish_blocks', true ],
			[ 'administrator', 'genesis_custom_block_read_block', true ],
			[ 'administrator', 'genesis_custom_block_read_private_blocks', true ],
			[ 'administrator', 'genesis_custom_block_delete_block', true ],
		];
	}

	/**
	 * Tests that the capabilities are correct for the post type.
	 *
	 * @dataProvider get_users
	 * @covers \Genesis\CustomBlocks\PostTypes\BlockPost::register_post_type()
	 *
	 * @param string $user_role The user role, like 'editor'.
	 * @param string $capability The capability to test for, like 'edit_post'.
	 * @param bool   $expected The expected result for those capability and roles.
	 */
	public function test_user_capability( $user_role, $capability, $expected ) {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => $user_role ] ) );
		$this->assertEquals( $expected, current_user_can( $capability, $this->post_id ) );
	}
}
