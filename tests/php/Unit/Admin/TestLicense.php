<?php
/**
 * Tests for class License.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Admin\License;
use Genesis\CustomBlocks\Admin\Settings;

/**
 * Tests for class License.
 */
class TestLicense extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of License.
	 *
	 * @var License
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
	const EXPECTED_LICENSE_REQUEST_FAILED_NOTICE = '<div class="notice notice-error"><p>There was a problem activating the license, but it may not be invalid. If the problem persists, please contact support.</p></div>';

	/**
	 * The notice for when the license is invalid.
	 *
	 * @var string
	 */
	const EXPECTED_LICENSE_INVALID_NOTICE = '<div class="notice notice-error"><p>There was a problem activating your Genesis Custom Blocks license.</p></div>';

	/**
	 * The notice for when the license validation succeeds.
	 *
	 * @var string
	 */
	const EXPECTED_LICENSE_SUCCESS_NOTICE = '<div class="notice notice-success"><p>Your Genesis Pro license was successfully activated!</p></div>';

	/**
	 * Sets up each test.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new License();
		$this->instance->set_plugin( genesis_custom_blocks() );
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertEquals( 10, has_filter( 'pre_update_option_genesis_pro_subscription_key', [ $this->instance, 'save_license_key' ] ) );
	}

	/**
	 * Test save_license_key with a 404 response.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::save_license_key()
	 */
	public function test_save_license_key_404() {
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return new WP_Error( 'The request failed' );
			}
		);
		$mock_invalid_license_key = '0000000';
		$returned_key             = $this->instance->save_license_key( $mock_invalid_license_key );

		// For the request failing, like with a 404, the method should return '', and the notice should be to retry or contact support.
		$this->assertEquals( '', $returned_key );
		$this->assertEquals(
			[ self::EXPECTED_LICENSE_REQUEST_FAILED_NOTICE ],
			get_option( Settings::NOTICES_OPTION_NAME )
		);
		delete_option( Settings::NOTICES_OPTION_NAME );
	}

	/**
	 * Test save_license_key when it's invalid.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::save_license_key()
	 */
	public function test_save_license_key_invalid() {
		$mock_invalid_license_key = '0000000';
		// Cause the validation request to return that the license is invalid.
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
		$returned_key = $this->instance->save_license_key( $mock_invalid_license_key );

		// For an invalid license (not simply the request failing), the method should return ''.
		$this->assertEquals( '', $returned_key );
	}

	/**
	 * Test save_license_key when it's valid.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::save_license_key()
	 */
	public function test_save_license_key_valid() {
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return [ 'response' => [ 'code' => 200 ] ];
			}
		);

		$this->set_license_validity( true );
		$mock_valid_license_key = '9250342';
		$returned_key           = $this->instance->save_license_key( $mock_valid_license_key );
		$this->assertEquals( $mock_valid_license_key, $returned_key );
		$this->assertEquals(
			[ self::EXPECTED_LICENSE_SUCCESS_NOTICE ],
			get_option( Settings::NOTICES_OPTION_NAME )
		);
	}

	/**
	 * Test is_valid.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::is_valid()
	 */
	public function test_is_valid() {
		// The transient is not set at all, so this should be false.
		$this->assertFalse( $this->instance->is_valid() );

		set_transient(
			License::TRANSIENT_NAME,
			'valid'
		);

		$this->assertTrue( $this->instance->is_valid() );

	}

	/**
	 * Test get_license_status.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::get_license_status()
	 */
	public function test_get_license_status() {
		$valid_license_transient_value   = 'valid';
		$invalid_license_transient_value = 'key-invalid';

		// If the transient is set, get_license_status() should simply return it.
		set_transient( License::TRANSIENT_NAME, $valid_license_transient_value );
		$this->assertEquals( $valid_license_transient_value, $this->instance->get_license_status() );

		set_transient( License::TRANSIENT_NAME, $invalid_license_transient_value );
		$this->assertEquals( $invalid_license_transient_value, $this->instance->get_license_status() );

		// If there's no transient or option, this should return false.
		delete_transient( License::TRANSIENT_NAME );
		$this->assertFalse( $this->instance->get_license_status() );
	}

	/**
	 * Test get_license_status when none is stored.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::get_license_status()
	 */
	public function test_get_license_status_none_stored() {
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

		$example_valid_license_key = '5134315';
		add_option( License::OPTION_NAME, $example_valid_license_key );

		// If the license transient is empty, this should look at the option value and make a request to validate that.
		$this->assertEquals( $expected_error_code, $this->instance->get_license_status() );
	}
	/**
	 * Test get_license_status when this is locked from making more requests.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::get_license_status()
	 */
	public function test_get_license_status_locked() {
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return [ 'response' => [ 'code' => 200 ] ];
			}
		);

		$requests_locked_value = 'license_requests_locked';
		set_transient( License::TRANSIENT_NAME, $requests_locked_value );

		// This can be locked from making more requests once a request is in progress, to avoid a stampede.
		// So this should simply return the fact that this is locked, without making another request.
		$this->assertEquals( $requests_locked_value, $this->instance->get_license_status() );
	}

	/**
	 * Test activate_license with an error.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::activate_license()
	 */
	public function test_activate_license_error() {
		$license_key = '6234234';
		add_filter(
			self::HTTP_FILTER_NAME,
			static function( $response ) {
				unset( $response );
				return new WP_Error();
			}
		);

		$expected = 'request_failed';
		$actual   = $this->instance->activate_license( $license_key );

		$this->assertEquals( $expected, $actual );

		// This should also store the result in the transient.
		$this->assertEquals(
			$expected,
			get_transient( License::TRANSIENT_NAME )
		);
	}

	/**
	 * Test activate_license with success.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::activate_license()
	 */
	public function test_activate_license_success() {
		add_filter(
			self::HTTP_FILTER_NAME,
			function( $response ) {
				unset( $response );
				return [ 'response' => [ 'code' => 200 ] ];
			}
		);
		$license_key = '6234234';
		$this->instance->activate_license( $license_key );

		// Having simulated a successful license validation with the filter above, this should activate the license.
		$this->assertEquals( 'valid', get_transient( License::TRANSIENT_NAME ) );
	}

	/**
	 * Test license_success_message.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::license_success_message()
	 */
	public function test_license_success_message() {
		$this->assertEquals(
			self::EXPECTED_LICENSE_SUCCESS_NOTICE,
			$this->instance->license_success_message()
		);
	}

	/**
	 * Test license_request_failed_message.
	 *
	 * @covers \Genesis\CustomBlocks\Admin\License::license_request_failed_message()
	 */
	public function test_license_request_failed_message() {
		$this->assertEquals(
			self::EXPECTED_LICENSE_REQUEST_FAILED_NOTICE,
			$this->instance->license_request_failed_message()
		);
	}

	/**
	 * Gets the test data for get_data_license_invalid().
	 *
	 * @return array The test data.
	 */
	public function get_data_license_invalid() {
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
	 * Test license_invalid_message.
	 *
	 * @dataProvider get_data_license_invalid
	 * @covers \Genesis\CustomBlocks\Admin\License::license_invalid_message()
	 *
	 * @param string $error_code The license error code.
	 * @param string $expected   The expected error message.
	 */
	public function test_license_invalid_message( $error_code, $expected ) {
		$this->assertEquals(
			$expected,
			$this->instance->license_invalid_message( $error_code )
		);
	}
}
