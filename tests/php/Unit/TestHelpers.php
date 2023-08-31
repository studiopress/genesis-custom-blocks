<?php
/**
 * Tests for Helpers.php.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Block;
use Genesis\CustomBlocks\Blocks\Loader;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

/**
 * Tests for Helpers.php.
 */
class TestHelpers extends \WP_UnitTestCase {

	// Shows the assertions as passing.
	use MockeryPHPUnitIntegration;

	/**
	 * Teardown.
	 *
	 * @inheritdoc
	 */
	public function tear_down() {
		genesis_custom_blocks()->loader = new Loader();
		remove_all_filters( 'genesis_custom_blocks_default_fields' );
		remove_all_filters( 'genesis_custom_blocks_data_attributes' );
		remove_all_filters( 'genesis_custom_blocks_data_config' );

		parent::tear_down();
	}

	/**
	 * Test block_field.
	 *
	 * @covers ::block_field()
	 */
	public function test_block_field() {
		$field_name     = 'test-user';
		$class_key      = 'className';
		$expected_class = 'baz-class';
		$mock_text      = 'Example text';

		add_filter(
			'genesis_custom_blocks_data_attributes',
			function ( $data ) use ( $field_name, $class_key, $mock_text, $expected_class ) {
				if ( ! is_array( $data ) ) {
					$data = [];
				}

				$data[ $field_name ] = $mock_text;
				$data[ $class_key ]  = $expected_class;
				return $data;
			}
		);

		add_filter(
			'genesis_custom_blocks_data_config',
			function ( $data ) use ( $field_name ) {
				unset( $data );
				$field_config = [ 'control' => 'text' ];
				$block_config = [
					'fields' => [
						$field_name => $field_config,
					],
				];

				$data = new Block();
				$data->from_array( $block_config );

				return $data;
			}
		);

		// Because block_field() had the second argument of false, this should return the value stored in the field, not echo it.
		ob_start();
		$return_value = block_field( $field_name, false );
		$echoed       = ob_get_clean();
		$this->assertEquals( $mock_text, $return_value );
		$this->assertEmpty( $echoed );

		// Test the same scenario as above, but for 'className'.
		ob_start();
		$return_value = block_field( $class_key, false );
		$echoed       = ob_get_clean();
		$this->assertEquals( $expected_class, $return_value );
		$this->assertEmpty( $echoed );

		ob_start();
		$return_value      = block_field( $field_name, true );
		$actual_user_login = ob_get_clean();

		// Because block_field() has a second argument of true, this should echo the user login and return null.
		$this->assertEquals( $mock_text, $actual_user_login );
		$this->assertEquals( null, $return_value );

		ob_start();
		$return_value = block_field( $class_key, true );
		$actual_class = ob_get_clean();

		// Test the same scenario as above, but for 'className'.
		$this->assertEquals( $expected_class, $actual_class );
		$this->assertEquals( null, $return_value );

		$additional_field_name  = 'example_additional_field';
		$additional_field_value = 'Here is some text';

		remove_all_filters( 'genesis_custom_blocks_data_attributes' );

		add_filter(
			'genesis_custom_blocks_data_attributes',
			function () use ( $additional_field_name, $additional_field_value ) {
				return [ $additional_field_name => $additional_field_value ];
			}
		);

		ob_start();
		$return_value = block_field( $additional_field_name, true );
		$echoed_value = ob_get_clean();

		// When a field isn't in the genesis_custom_blocks()->loader->data['config'], it should not be echoed or returned.
		$this->assertEmpty( $return_value );
		$this->assertEmpty( $echoed_value );

		$default_fields_filter = 'genesis_custom_blocks_default_fields';

		// Don't return anything from the filter callback, to test the behavior.
		add_filter(
			$default_fields_filter,
			function ( $default_fields ) use ( $additional_field_name ) {
				$default_fields[] = $additional_field_name;
			}
		);

		ob_start();
		$return_value = block_field( $additional_field_name, true );
		$echoed_value = ob_get_clean();

		// In case the filter accidentally doesn't return anything, there should still not be a fatal error, there should just be no output.
		$this->assertEmpty( $return_value );
		$this->assertEmpty( $echoed_value );
		remove_all_filters( $default_fields_filter );

		add_filter(
			$default_fields_filter,
			function ( $default_fields ) use ( $additional_field_name ) {
				$default_fields[ $additional_field_name ] = 'string';
				return $default_fields;
			}
		);

		ob_start();
		$return_value = block_field( $additional_field_name, true );
		$echoed_value = ob_get_clean();

		// Now that the filter includes the additional field, the field should be echoed, even though it's not in genesis_custom_blocks()->data['config'].
		$this->assertEquals( null, $return_value );
		$this->assertEquals( $additional_field_value, $echoed_value );
	}
}
