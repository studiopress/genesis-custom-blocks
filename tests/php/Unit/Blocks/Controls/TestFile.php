<?php
/**
 * Tests for class File.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\File;

/**
 * Tests for class File.
 */
class TestFile extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of the extending class File.
	 *
	 * @var File
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new File();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\File::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'file', $this->instance->name );
		$this->assertEquals( 'File', $this->instance->label );
	}

	/**
	 * Test register_settings.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\File::register_settings()
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
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\File::validate()
	 */
	public function test_validate() {
		$pdf_file      = 'example.pdf';
		$attachment_id = $this->factory()->attachment->create_object(
			[ 'file' => $pdf_file ],
			0,
			[
				'post_mime_type' => 'application/pdf',
			]
		);

		// This is needed because attachments seem to usually have this kind of metadata.
		wp_update_attachment_metadata( $attachment_id, [ 'file' => $pdf_file ] );
		$attachment_url = wp_get_attachment_url( $attachment_id );

		$this->assertEquals( $attachment_url, $this->instance->validate( $attachment_id, true ) );
		$this->assertEquals( $attachment_id, $this->instance->validate( $attachment_id, false ) );
	}
}
