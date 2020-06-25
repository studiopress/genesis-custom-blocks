<?php
/**
 * Tests for class Subscription.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\Subscription;
use Genesis\CustomBlocks\Admin\Settings;

/**
 * Tests for class Subscription.
 */
class TestSubscription extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Subscription.
	 *
	 * @var Subscription
	 */
	public $instance;

	/**
	 * The name of a HTTP filter.
	 *
	 * @var string
	 */
	const HTTP_FILTER_NAME = 'pre_http_request';

	/**
	 * The notice for when the validation request fails.
	 *
	 * @var string
	 */
	const EXPECTED_SUBSCRIPTION_EMPTY_NOTICE = '<div class="notice notice-error"><p>The subscription key was empty. Please enter a subscription key.</p></div>';

	/**
	 * The notice for when the validation request fails.
	 *
	 * @var string
	 */
	const EXPECTED_SUBSCRIPTION_FAILED_NOTICE = '<div class="notice notice-error"><p>There was a problem activating the subscription key, but it may not be invalid. If the problem persists, please contact support.</p></div>';

	/**
	 * The notice for when the subscription key is invalid.
	 *
	 * @var string
	 */
	const EXPECTED_SUBSCRIPTION_INVALID_NOTICE = '<div class="notice notice-error"><p>There was a problem activating your Genesis Custom Blocks subscription key.</p></div>';

	/**
	 * The notice for when the subscription validation succeeds.
	 *
	 * @var string
	 */
	const EXPECTED_SUBSCRIPTION_SUCCESS_NOTICE = '<div class="notice notice-success"><p>Your Genesis Pro subscription key was successfully activated!</p></div>';

	/**
	 * Sets up each test.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new Subscription();
		$this->instance->set_plugin( genesis_custom_blocks() );
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertEquals( 10, has_filter( 'pre_update_option_genesis_pro_subscription_key', [ $this->instance, 'save_subscription_key' ] ) );
	}

	/**
	 * Gets the testing data for test_save_subscription_key_empty().
	 *
	 * @return array The testing data.
	 */
	public function get_data_test_save_subscription_empty() {
		return [
			[ '' ],
			[ '0' ],
			[ 0 ],
			[ false ],
		];
	}

	/**
	 * Test save_subscription_key when the key is empty.
	 *
	 * @dataProvider get_data_test_save_subscription_empty
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::save_subscription_key()
	 *
	 * @param string $empty_subscription_key The entered subscription key.
	 */
	public function test_save_subscription_key_empty( $empty_subscription_key ) {
		$returned_key = $this->instance->save_subscription_key( $empty_subscription_key );

		$this->assertFalse( get_transient( Subscription::TRANSIENT_NAME ) );
		$this->assertEquals(
			[ self::EXPECTED_SUBSCRIPTION_EMPTY_NOTICE ],
			get_option( Settings::NOTICES_OPTION_NAME )
		);
		$this->assertFalse( $returned_key );
	}

	/**
	 * Test save_subscription_key with a 404 response.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::save_subscription_key()
	 */
	public function test_save_subscription_key_404() {
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return new WP_Error( 'The request failed' );
			}
		);
		$mock_invalid_subscription_key = '0000000';
		$returned_key                  = $this->instance->save_subscription_key( $mock_invalid_subscription_key );

		// For the request failing, like with a 404, the method should return false, and the notice should be to retry or contact support.
		$this->assertFalse( $returned_key );
		$this->assertEquals(
			[ self::EXPECTED_SUBSCRIPTION_FAILED_NOTICE ],
			get_option( Settings::NOTICES_OPTION_NAME )
		);
	}

	/**
	 * Test save_subscription_key when it's invalid.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::save_subscription_key()
	 */
	public function test_save_subscription_key_invalid() {
		$mock_invalid_subscription_key = '0000000';
		// Cause the validation request to return that the subscription is invalid.
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return [
					'response' => [ 'code' => 400 ],
					'body'     => wp_json_encode( [ 'error_code' => 'key-invalid' ] ),
				];
			}
		);

		// For an invalid subscription (not simply the request failing), the method should return false.
		$this->assertFalse( $this->instance->save_subscription_key( $mock_invalid_subscription_key ) );
	}

	/**
	 * Test save_subscription_key when it's valid.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::save_subscription_key()
	 */
	public function test_save_subscription_key_valid() {
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return [ 'response' => [ 'code' => 200 ] ];
			}
		);

		$this->set_subscription_key_validity( true );
		$mock_valid_subscription_key = '9250342';
		$returned_key                = $this->instance->save_subscription_key( $mock_valid_subscription_key );
		$this->assertEquals( $mock_valid_subscription_key, $returned_key );
		$this->assertEquals(
			[ self::EXPECTED_SUBSCRIPTION_SUCCESS_NOTICE ],
			get_option( Settings::NOTICES_OPTION_NAME )
		);
	}

	/**
	 * Test is_valid.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::is_valid()
	 */
	public function test_is_valid() {
		// The transient is not set at all, so this should be false.
		$this->assertFalse( $this->instance->is_valid() );

		set_transient(
			Subscription::TRANSIENT_NAME,
			'valid'
		);

		$this->assertTrue( $this->instance->is_valid() );

	}

	/**
	 * Test get_subscription_status.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::get_subscription_status()
	 */
	public function test_get_subscription_status() {
		$valid_subscription_transient_value   = 'valid';
		$invalid_subscription_transient_value = 'key-invalid';

		// If the transient is set, get_subscription_status() should simply return it.
		set_transient( Subscription::TRANSIENT_NAME, $valid_subscription_transient_value );
		$this->assertEquals( $valid_subscription_transient_value, $this->instance->get_subscription_status() );

		set_transient( Subscription::TRANSIENT_NAME, $invalid_subscription_transient_value );
		$this->assertEquals( $invalid_subscription_transient_value, $this->instance->get_subscription_status() );

		// If there's no transient or option, this should return false.
		delete_transient( Subscription::TRANSIENT_NAME );
		$this->assertFalse( $this->instance->get_subscription_status() );
	}

	/**
	 * Test get_subscription_status when none is stored.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::get_subscription_status()
	 */
	public function test_get_subscription_status_none_stored() {
		$expected_error_code = 'key-deleted';
		add_filter(
			self::HTTP_FILTER_NAME,
			function( $response ) use ( $expected_error_code ) {
				unset( $response );
				return [
					'body' => wp_json_encode( [ 'error_code' => $expected_error_code ] ),
					'code' => 400,
				];
			}
		);

		$example_valid_subscription_key = '5134315';
		add_option( Subscription::OPTION_NAME, $example_valid_subscription_key );

		// If the subscription transient is empty, this should look at the option value and make a request to validate that.
		$this->assertEquals( $expected_error_code, $this->instance->get_subscription_status() );
	}
	/**
	 * Test get_subscription_status when this is locked from making more requests.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::get_subscription_status()
	 */
	public function test_get_subscription_status_locked() {
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return [ 'response' => [ 'code' => 200 ] ];
			}
		);

		$requests_locked_value = 'subscription_requests_locked';
		set_transient( Subscription::TRANSIENT_NAME, $requests_locked_value );

		// This can be locked from making more requests once a request is in progress, to avoid a stampede.
		// So this should simply return the fact that this is locked, without making another request.
		$this->assertEquals( $requests_locked_value, $this->instance->get_subscription_status() );
	}

	/**
	 * Test activate_subscription with an error.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::activate_subscription()
	 */
	public function test_activate_subscription_error() {
		$subscription_key = '6234234';
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return new WP_Error();
			}
		);

		$expected = 'request_failed';
		$actual   = $this->instance->activate_subscription( $subscription_key );

		$this->assertEquals( $expected, $actual );

		// This should also store the result in the transient.
		$this->assertEquals(
			$expected,
			get_transient( Subscription::TRANSIENT_NAME )
		);
	}

	/**
	 * Test activate_subscription with success.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::activate_subscription()
	 */
	public function test_activate_subscription_success() {
		add_filter(
			self::HTTP_FILTER_NAME,
			function( $response ) {
				unset( $response );
				return [ 'response' => [ 'code' => 200 ] ];
			}
		);
		$subscription_key = '6234234';
		$this->instance->activate_subscription( $subscription_key );

		// Having simulated a successful subscription validation with the filter above, this should activate the subscription.
		$this->assertEquals( 'valid', get_transient( Subscription::TRANSIENT_NAME ) );
	}

	/**
	 * Test subscription_success_message.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::subscription_success_message()
	 */
	public function test_subscription_success_message() {
		$this->assertEquals(
			self::EXPECTED_SUBSCRIPTION_SUCCESS_NOTICE,
			$this->instance->subscription_success_message()
		);
	}

	/**
	 * Test subscription_request_failed_message.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::subscription_request_failed_message()
	 */
	public function test_subscription_request_failed_message() {
		$this->assertEquals(
			self::EXPECTED_SUBSCRIPTION_FAILED_NOTICE,
			$this->instance->subscription_request_failed_message()
		);
	}

	/**
	 * Gets the test data for get_data_subscription_invalid().
	 *
	 * @return array The test data.
	 */
	public function get_data_subscription_invalid() {
		return [
			'unknown'          => [
				'key-unknown',
				'<div class="notice notice-error"><p>The subscription key you entered appears to be invalid or is not associated with this product. Please verify the key you have saved here matches the key in your <a href="https://my.wpengine.com/products/genesis_pro" target="_blank" rel="noreferrer noopener">WP Engine Account Portal</a>.</p></div>',
			],
			'invalid'          => [
				'key-invalid',
				'<div class="notice notice-error"><p>The subscription key you entered is invalid. Get your subscription key in the <a href="https://my.wpengine.com/products/genesis_pro" target="_blank" rel="noreferrer noopener">WP Engine Account Portal</a>.</p></div>',
			],
			'unrecognized_key' => [
				'random-unknown-key',
				'<div class="notice notice-error"><p>There was an unknown error connecting to the update service. Please ensure the key you have saved here matches the key in your <a href="https://my.wpengine.com/products/genesis_pro" target="_blank" rel="noreferrer noopener">WP Engine Account Portal</a>. This issue could be temporary. Please contact support if this error persists.</p></div>',
			],
		];
	}

	/**
	 * Test subscription_invalid_message.
	 *
	 * @dataProvider get_data_subscription_invalid
	 * @covers \Genesis\CustomBlocks\Admin\Subscription::subscription_invalid_message()
	 *
	 * @param string $error_code The subscription error code.
	 * @param string $expected   The expected error message.
	 */
	public function test_subscription_invalid_message( $error_code, $expected ) {
		$this->assertEquals(
			$expected,
			$this->instance->subscription_invalid_message( $error_code )
		);
	}
}
