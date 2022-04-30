<?php
/**
 * Tests for class Field.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Field;

/**
 * Tests for class Field.
 */
class TestField extends \WP_UnitTestCase {

	/**
	 * The instance to test.
	 *
	 * @var Field
	 */
	public $instance;

	/**
	 * A mock config array for the field.
	 *
	 * @var array
	 */
	public $config = [
		'name'     => 'foo',
		'label'    => 'Foo',
		'control'  => 'number',
		'type'     => 'integer',
		'order'    => 1,
		'settings' => [
			'custom' => 'Custom Setting',
		],
	];

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp(): void { // phpcs:ignore PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations.voidFound
		parent::setUp();

		$this->instance = new Field( [] );
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Field::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( '', $this->instance->name );
		$this->assertEquals( '', $this->instance->label );
		$this->assertEquals( 'text', $this->instance->control );
		$this->assertEquals( 'string', $this->instance->type );
		$this->assertEquals( 0, $this->instance->order );
		$this->assertEquals( [], $this->instance->settings );
	}

	/**
	 * Test from_array.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Field::from_array()
	 */
	public function test_from_array() {
		$this->instance->from_array( $this->config );

		$this->assertEquals( 'foo', $this->instance->name );
		$this->assertEquals( 'Foo', $this->instance->label );
		$this->assertEquals( 'number', $this->instance->control );
		$this->assertEquals( 'integer', $this->instance->type );
		$this->assertEquals( 1, $this->instance->order );
		$this->assertArrayHasKey( 'custom', $this->instance->settings );
		$this->assertEquals( 'Custom Setting', $this->instance->settings['custom'] );
	}

	/**
	 * Test from_array when there is no 'type' in the $config argument.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Field::from_array()
	 */
	public function test_from_array_without_type() {
		genesis_custom_blocks()->block_post->register_controls();
		$this->instance->from_array( [ 'control' => 'rich_text' ] );
		$this->assertEquals( 'string', $this->instance->type );

		$this->instance = new Field( [] );
		$this->instance->from_array( [ 'control' => 'image' ] );
		$this->assertEquals( 'integer', $this->instance->type );

		// The control class doesn't exist, so this shouldn't change the default value of $type, 'string'.
		$this->instance = new Field( [] );
		$this->instance->from_array( [ 'control' => 'non-existent' ] );
		$this->assertEquals( 'string', $this->instance->type );
	}

	/**
	 * Test to_array.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Field::to_array()
	 */
	public function test_to_array() {
		$this->instance->from_array( $this->config );
		$config = $this->instance->to_array();

		$this->assertEquals( 'foo', $config['name'] );
		$this->assertEquals( 'Foo', $config['label'] );
		$this->assertEquals( 'number', $config['control'] );
		$this->assertEquals( 'integer', $config['type'] );
		$this->assertEquals( 1, $config['order'] );
		$this->assertArrayHasKey( 'custom', $config );
		$this->assertArrayNotHasKey( 'settings', $config );
		$this->assertEquals( 'Custom Setting', $config['custom'] );
	}

	/**
	 * Test cast_value on a textarea field with no autop.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Field::cast_value()
	 */
	public function test_cast_value_textarea_no_autop() {
		$field         = new Field(
			[
				'type'    => 'text',
				'control' => 'textarea',
			]
		);
		$initial_value = "\n\n Here is some text \n\n This is more";

		$this->assertEquals( $initial_value, $field->cast_value( $initial_value ) );
	}

	/**
	 * Test cast_value on a textarea field with autop.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Field::cast_value()
	 */
	public function test_cast_value_textarea_with_autop() {
		$field = new Field(
			[
				'type'     => 'text',
				'control'  => 'textarea',
				'settings' => [ 'new_lines' => 'autop' ],
			]
		);

		$this->assertEquals(
			"<p>Here is some text<br />\n This is more</p>\n",
			$field->cast_value( "Here is some text \n This is more" )
		);
	}

	/**
	 * Test cast_value on a textarea field with autobr.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Field::cast_value()
	 */
	public function test_cast_value_textarea_with_autobr() {
		$field = new Field(
			[
				'type'     => 'text',
				'control'  => 'textarea',
				'settings' => [ 'new_lines' => 'autobr' ],
			]
		);

		$this->assertEquals(
			"Here is some text <br />\n This is more <br />\n Here is another one",
			$field->cast_value( "Here is some text \n This is more \n Here is another one" )
		);
	}
}
