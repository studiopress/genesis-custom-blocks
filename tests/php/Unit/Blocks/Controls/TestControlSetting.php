<?php
/**
 * Tests for class ControlSetting.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\ControlSetting;

/**
 * Tests for class ControlSetting.
 */
class TestControlSetting extends \WP_UnitTestCase {

	/**
	 * Instance of ControlSetting.
	 *
	 * @var Controls
	 */
	public $instance;

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlSetting::__construct()
	 */
	public function test_construct() {
		$this->instance          = new ControlSetting( [] );
		$initial_property_values = [
			'name'    => '',
			'label'   => '',
			'type'    => '',
			'default' => '',
			'help'    => '',
			'value'   => null,
		];

		// When an empty array is passed to the constructor, it should have the initial property values.
		foreach ( $initial_property_values as $initial_property_name => $initial_property_value ) {
			$this->assertEquals( $initial_property_value, $this->instance->$initial_property_name );
		}
		$this->assertEquals( 'Genesis\CustomBlocks\Blocks\Controls\ControlSetting', get_class( $this->instance ) );

		// Each of the properties below passed in the constructor should be added as properties.
		$expected_properties = [
			'name'    => 'help',
			'label'   => 'Help Text',
			'type'    => 'text',
			'default' => '',
			'help'    => '',
			'value'   => null,
		];

		$this->instance = new ControlSetting( $expected_properties );
		foreach ( $expected_properties as $property_key => $property_value ) {
			$this->assertEquals( $property_value, $this->instance->$property_key );
		}

		// A property should be set as long isset(), so test that empty properties are set.
		$empty_properties = [
			'default' => 0,
			'value'   => 0,
		];

		$this->instance = new ControlSetting( $empty_properties );
		foreach ( $empty_properties as $empty_property_key => $empty_property_value ) {
			$this->assertEquals( $empty_property_value, $this->instance->$empty_property_key );
		}

		// When non-whitelisted array keys appear, they shouldn't be added as properties.
		$incorrect_properties = [
			'wrong_property' => 'something',
			'baz_prop'       => 'example',
			'bar_property'   => 'foo bar',
		];

		$this->instance = new ControlSetting( $incorrect_properties );
		foreach ( $incorrect_properties as $incorrect_property_key => $incorrect_property_value ) {
			$this->assertFalse( property_exists( $this->instance, $incorrect_property_key ) );
		}
	}

	/**
	 * Test get_value.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlSetting::get_value()
	 */
	public function get_value() {
		$default        = 'this is a default';
		$this->instance = new ControlSetting( [ 'default' => $default ] );

		// If the value is null, this should return the default.
		$this->assertEquals( $default, $this->instance->get_value() );

		$expected_value = 'Here is a value';
		$this->instance = new ControlSetting(
			[
				'value'   => $expected_value,
				'default' => $default,
			]
		);

		// If the value is anything other than null, this should return it.
		$this->assertEquals( $expected_value, $this->instance->get_value() );

		$int_expected_value = 5400;
		$this->instance     = new ControlSetting(
			[
				'value'   => $int_expected_value,
				'default' => $default,
			]
		);
		$this->assertEquals( $int_expected_value, $this->instance->get_value() );
	}
}
