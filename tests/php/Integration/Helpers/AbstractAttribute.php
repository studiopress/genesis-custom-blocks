<?php
/**
 * AbstractAttribute
 *
 * @package Genesis\CustomBlocks
 */

/**
 * Class AbstractAttribute
 *
 * @package Genesis\CustomBlocks
 */
abstract class AbstractAttribute extends \WP_UnitTestCase {

	/**
	 * The block attributes.
	 *
	 * @var array
	 */
	public $attributes;

	/**
	 * All fields that return a string for block_value().
	 *
	 * @var array
	 */
	public $string_fields;

	/**
	 * All fields that return either an object or ID for block_value().
	 *
	 * @var array
	 */
	public $object_fields;

	/**
	 * The name of the block that tests all fields.
	 *
	 * This also controls the template that will be used.
	 * For example, if $block_name is 'your-example-block',
	 * the template will be at Fixtures/your-example-block.php.
	 *
	 * @var string
	 */
	public $block_name;

	/**
	 * The path to the blocks/ directory in the theme.
	 *
	 * @var string
	 */
	public $blocks_directory;

	/**
	 * The block class name.
	 *
	 * @var string
	 */
	public $class_name = 'example-name';

	/**
	 * The names of the fields that don't fall into the string or object field classifications.
	 *
	 * @var string[]
	 */
	public $special_case_field_names = [
		'checkbox',
		'image',
		'toggle',
	];

	/**
	 * Invokes a protected method.
	 *
	 * @param object $instance The instance to invoke the method on.
	 * @param string $method_name The name of the method.
	 * @param array  $args The arguments.
	 * @return mixed The result of invoking the method.
	 * @throws ReflectionException If invoking this fails.
	 */
	public function invoke_protected_method( $instance, $method_name, $args = [] ) {
		$method = new ReflectionMethod( $instance, $method_name );
		$method->setAccessible( true );
		return $method->invokeArgs( $instance, $args );
	}

	/**
	 * Creates the block template.
	 *
	 * Instead of copying the fixture entirely into the theme directory,
	 * this puts an include statement in it, pointing to the fixture.
	 */
	public function create_block_template() {}

	/**
	 * Gets the image attribute.
	 *
	 * @return int The image's ID.
	 */
	public function get_image_attribute() {
		return $this->factory()->attachment->create_object(
			[ 'file' => 'baz.jpeg' ],
			0,
			[ 'post_mime_type' => 'image/jpeg' ]
		);
	}
}
