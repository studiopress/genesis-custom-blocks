<?php
/**
 * Tests for class Field.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks;

/**
 * Tests for class Field.
 */
class TestField extends \WP_UnitTestCase {

	/**
	 * The instance to test.
	 *
	 * @var Blocks\Field
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
	public function setUp() {
		parent::setUp();

		$this->instance = new Blocks\Field( [] );
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
		$this->assertAttributeNotEmpty( 'settings', $this->instance );
		$this->assertArrayHasKey( 'custom', $this->instance->settings );
		$this->assertEquals( 'Custom Setting', $this->instance->settings['custom'] );
	}

	/**
	 * Test from_array when there is no 'type' in the $config argument.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Field::from_array()
	 */
	public function test_from_array_without_type() {
		$this->instance->from_array( [ 'control' => 'rich_text' ] );
		$this->assertEquals( 'string', $this->instance->type );

		$this->instance = new Blocks\Field( [] );
		$this->instance->from_array( [ 'control' => 'image' ] );
		$this->assertEquals( 'integer', $this->instance->type );

		// The control class doesn't exist, so this shouldn't change the default value of $type, 'string'.
		$this->instance = new Blocks\Field( [] );
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
}
