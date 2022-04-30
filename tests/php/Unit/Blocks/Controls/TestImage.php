<?php
/**
 * Tests for class Image.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Image;

/**
 * Tests for class Image.
 */
class TestImage extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of the extending class Image.
	 *
	 * @var Image
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp(): void { // phpcs:ignore PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations.voidFound
		parent::setUp();
		$this->instance = new Image();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Image::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'image', $this->instance->name );
		$this->assertEquals( 'Image', $this->instance->label );
	}

	/**
	 * Test register_settings.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Image::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
			[
				'name'    => 'location',
				'label'   => 'Field Location',
				'type'    => 'location',
				'default' => 'editor',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'width',
				'label'   => 'Field Width',
				'type'    => 'width',
				'default' => '100',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'help',
				'label'   => 'Help Text',
				'type'    => 'text',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}

	/**
	 * Test validate.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Image::validate()
	 */
	public function test_validate() {
		$image_file             = 'bar.jpeg';
		$expected_attachment_id = $this->factory()->attachment->create_object(
			[ 'file' => $image_file ],
			0,
			[
				'post_mime_type' => 'image/jpeg',
			]
		);

		// This is needed because attachments seem to usually have this kind of metadata.
		wp_update_attachment_metadata( $expected_attachment_id, [ 'file' => $image_file ] );
		$valid_attachment_url   = wp_get_attachment_url( $expected_attachment_id );
		$wp_upload              = wp_get_upload_dir();
		$invalid_attachment_url = $wp_upload['url'] . '/invalid.jpeg';

		$this->assertEquals( 0, $this->instance->validate( $invalid_attachment_url, false ) );
		$this->assertEquals( $expected_attachment_id, $this->instance->validate( $valid_attachment_url, false ) );
		$this->assertEquals( $expected_attachment_id, $this->instance->validate( $expected_attachment_id, false ) );
		$this->assertContains( $valid_attachment_url, $this->instance->validate( $valid_attachment_url, true ) );

		// This should still return an external URL, though the ID will be 0.
		$external_url = 'https://example.com/baz.jpeg';
		$this->assertEquals( 0, $this->instance->validate( $external_url, false ) );
		$this->assertContains( $external_url, $this->instance->validate( $external_url, true ) );
	}
}
