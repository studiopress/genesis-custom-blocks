<?php
/**
 * Tests for class InnerBlocks.
 *
 * @package Genesis\CustomBlocks
 */

use function Brain\Monkey\setUp;
use function Brain\Monkey\tearDown;
use function Brain\Monkey\Functions\expect;
use Genesis\CustomBlocks\Blocks\Controls\InnerBlocks;

/**
 * Tests for class InnerBlocks.
 */
class TestInnerBlocks extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of InnerBlocks.
	 *
	 * @var InnerBlocks
	 */
	public $instance;

	/**
	 * Set up before each test.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		setUp();
		$this->instance = new InnerBlocks();
	}

	/**
	 * Tear down.
	 *
	 * @inheritdoc
	 */
	public function tearDown() {
		remove_all_filters( 'genesis_custom_blocks_data_content' );
		tearDown();
		parent::tearDown();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\InnerBlocks::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Inner Blocks', $this->instance->label );
		$this->assertEquals( [ 'editor' => 'Editor' ], $this->instance->locations );
		$this->assertEquals( 'inner_blocks', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\InnerBlocks::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
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
	 * Test validate with inner blocks in the content.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\InnerBlocks::validate()
	 */
	public function test_validate_with_content() {
		$content = '<p>Here is example inner blocks content</p>';
		add_filter(
			'genesis_custom_blocks_data_content',
			function() use ( $content ) {
				return $content;
			}
		);

		$this->assertEquals( $content, $this->instance->validate( '', false ) );
	}

	/**
	 * Test that validate returns the content when it is non-empty.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\InnerBlocks::validate()
	 */
	public function test_validate_inner_blocks_ignores_query_arg_when_content_present() {
		$content = 'Here is some example inner blocks content';
		add_filter(
			'genesis_custom_blocks_data_content',
			function() use ( $content ) {
				return $content;
			}
		);

		expect( 'filter_input' )
			->never()
			->with(
				INPUT_GET,
				'inner_blocks',
				FILTER_SANITIZE_STRING
			);

		$this->assertEquals( $content, $this->instance->validate( '', false ) );
	}

	/**
	 * Test validate with inner blocks in a query arg.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\InnerBlocks::validate()
	 */
	public function test_validate_inner_blocks_in_query_arg() {
		$inner_blocks = 'Here is some example inner blocks content';
		expect( 'filter_input' )
			->once()
			->with(
				INPUT_GET,
				'inner_blocks',
				FILTER_SANITIZE_STRING
			)
			->andReturn( $inner_blocks );

		$this->assertEquals( $inner_blocks, $this->instance->validate( '', false ) );
	}

	/**
	 * Test validate with inner blocks in a query arg, when it prepares to echo.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\InnerBlocks::validate()
	 */
	public function test_validate_inner_blocks_in_query_arg_echoed() {
		$inner_blocks = 'Here is some example inner blocks content';
		expect( 'filter_input' )
			->once()
			->with(
				INPUT_GET,
				'inner_blocks',
				FILTER_SANITIZE_STRING
			)
			->andReturn( $inner_blocks );

		$this->assertEquals( $inner_blocks, $this->instance->validate( '', true ) );
	}
}
