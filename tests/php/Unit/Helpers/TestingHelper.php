<?php
/**
 * Trait with a helper method for testing controls.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\Subscription;

/**
 * Trait with a helper method.
 */
trait TestingHelper {

	/**
	 * Assert that the settings are correct.
	 *
	 * $actual_settings has objects, and $expected_settings has arrays.
	 * So this iterates through the $expected_settings for each object,
	 * ensuring the key and value of the $expected_settings array match a property of the object.
	 *
	 * @param array $expected_settings The expected settings, an array of arrays.
	 * @param array $actual_settings The actual settings, an array of ControlSetting instances.
	 */
	public function assert_correct_settings( $expected_settings, $actual_settings ) {
		foreach ( $actual_settings as $settings_index => $setting ) {
			$expected_setting = $expected_settings[ $settings_index ];
			foreach ( $setting as $setting_key => $setting_value ) {
				unset( $setting_value );
				$this->assertEquals( $expected_setting[ $setting_key ], $setting->$setting_key );
				$this->assertEquals( 'Genesis\CustomBlocks\Blocks\Controls\ControlSetting', get_class( $setting ) );
			}
		}

		$this->assertEquals( count( $expected_settings ), count( $actual_settings ) );
	}

	/**
	 * Sets whether the subscription key is valid or not.
	 *
	 * @param bool $is_valid Whether the subscription key is valid.
	 */
	public function set_subscription_key_validity( $is_valid ) {
		$transient_value = $is_valid ? 'valid' : 'key-invalid';
		set_transient( Subscription::TRANSIENT_NAME, $transient_value );
	}
}
