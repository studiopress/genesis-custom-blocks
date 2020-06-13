<?php
/**
 * Tests for class RichText.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\RichText;

/**
 * Tests for class RichText.
 */
class TestRichText extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of RichText.
	 *
	 * @var RichText
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new RichText();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\RichText::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Rich Text', $this->instance->label );
		$this->assertEquals( 'rich_text', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\RichText::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
			[
				'name'     => 'help',
				'label'    => 'Help Text',
				'type'     => 'text',
				'default'  => '',
				'help'     => '',
				'sanitize' => 'sanitize_text_field',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'default',
				'label'    => 'Default Value',
				'type'     => 'text',
				'default'  => '',
				'help'     => '',
				'sanitize' => 'sanitize_text_field',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'placeholder',
				'label'    => 'Placeholder Text',
				'type'     => 'text',
				'default'  => '',
				'help'     => '',
				'sanitize' => 'sanitize_text_field',
				'validate' => '',
				'value'    => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}

	/**
	 * Test validate.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\RichText::validate()
	 */
	public function test_validate() {
		$markup_with_br_tags         = '<span>First line<br><br></span>';
		$expected_markup_with_p_tags = "<p><span>First line</p>\n<p></span></p>\n";

		// This should have the same results, whether the second $echo argument is true or false.
		$this->assertEquals( $expected_markup_with_p_tags, $this->instance->validate( $markup_with_br_tags, true ) );
		$this->assertEquals( $expected_markup_with_p_tags, $this->instance->validate( $markup_with_br_tags, false ) );

		$empty_paragraph = '<p></p>';
		$this->assertEquals( '', $this->instance->validate( $empty_paragraph, false ) );
	}
}
