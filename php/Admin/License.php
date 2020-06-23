<?php
/**
 * Enable and validate Pro version licensing.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class License
 */
class License extends ComponentAbstract {
	/**
	 * URL of the Genesis Custom Blocks store.
	 *
	 * @var string
	 */
	const LICENSE_ENDPOINT = 'https://wp-product-info.wpesvc.net/v1/plugins/genesis-custom-blocks/subscriptions/';

	/**
	 * Option name of the license.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'genesis_pro_subscription_key';

	/**
	 * The name of the license key transient.
	 *
	 * @var string
	 */
	const TRANSIENT_NAME = 'genesis_custom_blocks_license';

	/**
	 * The transient license value for when the request to validate the Pro license failed.
	 *
	 * This is for when the actual request fails, like if the user has blocked them.
	 * Not for when it returns that the license is invalid.
	 *
	 * @var string
	 */
	const LICENSE_REQUEST_FAILED = 'request_failed';

	/**
	 * The transient license value for when there was no error code in the validation, but it was not still not valid.
	 *
	 * @var string
	 */
	const LICENSE_ERROR_UNKNOWN = 'unknown';

	/**
	 * The license value saved if it's valid.
	 *
	 * @var string
	 */
	const LICENSE_VALID = 'valid';

	/**
	 * The transient value for when license requests are locked.
	 *
	 * @var string
	 */
	const LICENSE_REQUESTS_LOCKED = 'license_requests_locked';

	/**
	 * The timeout of license requests, in seconds.
	 *
	 * @var int
	 */
	const LICENSE_REQUEST_TIMEOUT = 10;

	/**
	 * Register any hooks that this component needs.
	 */
	public function register_hooks() {
		add_filter( 'pre_update_option_' . self::OPTION_NAME, [ $this, 'save_license_key' ] );
	}

	/**
	 * Check that the license key is valid before saving.
	 *
	 * @param string $key The license key that was submitted.
	 *
	 * @return string
	 */
	public function save_license_key( $key ) {
		$license = $this->activate_license( $key );

		if ( ! $this->is_valid() ) {
			$key = '';
			if ( self::LICENSE_REQUEST_FAILED === $license ) {
				genesis_custom_blocks()->admin->settings->prepare_notice( $this->license_request_failed_message() );
			} else {
				genesis_custom_blocks()->admin->settings->prepare_notice( $this->license_invalid_message( $license ) );
			}
		} else {
			genesis_custom_blocks()->admin->settings->prepare_notice( $this->license_success_message() );
		}

		return $key;
	}

	/**
	 * Check if the license if valid.
	 *
	 * @return bool
	 */
	public function is_valid() {
		return self::LICENSE_VALID === $this->get_license();
	}

	/**
	 * Retrieve the license data.
	 *
	 * @return mixed
	 */
	public function get_license() {
		$license = get_transient( self::TRANSIENT_NAME );

		if ( ! $license ) {
			$key = get_option( self::OPTION_NAME );
			if ( ! empty( $key ) ) {
				$license = $this->activate_license( $key );
			}
		}

		return $license;
	}

	/**
	 * Try to activate the license.
	 *
	 * @param string $key The license key to activate.
	 * @return string The license validation result.
	 */
	public function activate_license( $key ) {
		// If there's already a license validation request in progress,
		// prevent more requests that could create a stampede.
		if ( self::LICENSE_REQUESTS_LOCKED === get_transient( self::TRANSIENT_NAME ) ) {
			return self::LICENSE_REQUESTS_LOCKED;
		}

		set_transient( self::TRANSIENT_NAME, self::LICENSE_REQUESTS_LOCKED, self::LICENSE_REQUEST_TIMEOUT );

		// Call the Genesis Custom Blocks API.
		$response = wp_remote_get(
			self::LICENSE_ENDPOINT . $key,
			[ 'timeout' => self::LICENSE_REQUEST_TIMEOUT ]
		);

		if ( 200 === wp_remote_retrieve_response_code( $response ) ) {
			$license = self::LICENSE_VALID;
		} elseif ( is_wp_error( $response ) ) {
			$license = self::LICENSE_REQUEST_FAILED;
		} else {
			$response_body = json_decode( wp_remote_retrieve_body( $response ) );
			$license       = ! empty( $response_body->error_code ) ? $response_body->error_code : self::LICENSE_ERROR_UNKNOWN;
		}

		set_transient( self::TRANSIENT_NAME, $license, DAY_IN_SECONDS );

		return $license;
	}

	/**
	 * Admin notice for correct license details.
	 *
	 * @return string
	 */
	public function license_success_message() {
		$message = __( 'Your Genesis Custom Blocks license was successfully activated!', 'genesis-custom-blocks' );
		return sprintf( '<div class="notice notice-success"><p>%s</p></div>', esc_html( $message ) );
	}

	/**
	 * Admin notice for the license request failing.
	 *
	 * This is for a rare case when the validation request fails entirely, like if the user has blocked requests.
	 * It's not for when it returns that the license is invalid.
	 * This can help with debugging, as it'll point to whether the issue is related to WP or the license endpoint.
	 *
	 * @return string
	 */
	public function license_request_failed_message() {
		return sprintf(
			'<div class="notice notice-error"><p>%1$s</p></div>',
			__( 'There was a problem activating the license, but it may not be invalid. If the problem persists, please contact support.', 'genesis-custom-blocks' )
		);
	}

	/**
	 * Admin notice for incorrect license details.
	 *
	 * Forked from Genesis Page Builder.
	 *
	 * @param string $error_code The error code from the endpoint.
	 * @return string The error message to display in the notice.
	 */
	public function license_invalid_message( $error_code ) {
		$account_portal_link = sprintf(
			'<a href="%1$s" target="_blank" rel="noreferrer noopener">%2$s</a>',
			esc_url( 'https://my.wpengine.com/products/genesis_pro' ),
			esc_html__( 'WP Engine Account Portal', 'genesis-custom-blocks' )
		);

		switch ( $error_code ) {
			case 'key-unknown':
				$message = sprintf(
					/* translators: %1$s: Link to account portal. */
					esc_html__( 'The subscription key you entered appears to be invalid or is not associated with this product. Please verify the key you have saved here matches the key in your %1$s.', 'genesis-custom-blocks' ),
					$account_portal_link
				);
				break;

			case 'key-invalid':
				$message = sprintf(
					/* translators: %1$s: Link to account portal. */
					esc_html__( 'The subscription key you entered is invalid. Get your subscription key in the %1$s.', 'genesis-custom-blocks' ),
					$account_portal_link
				);
				break;

			case 'key-deleted':
				$message = sprintf(
					/* translators: %1$s: Link to account portal. */
					esc_html__( 'Your subscription key was regenerated in the %1$s but was not updated in this settings page. Update your subscription key here to receive updates.', 'genesis-custom-blocks' ),
					$account_portal_link
				);
				break;

			case 'subscription-expired':
				$message = sprintf(
					/* translators: %1$s: Link to account portal. */
					esc_html__( 'Your Genesis Pro subscription has expired. %1$s now.', 'genesis-custom-blocks' ),
					sprintf(
						'<a href="%1$s" target="_blank" rel="noreferrer noopener">%2$s</a>',
						esc_url( 'https://my.wpengine.com/modify_plan' ),
						esc_html__( 'Renew', 'genesis-custom-blocks' )
					)
				);
				break;

			case 'subscription-notfound':
				$message = esc_html__( 'A valid subscription for your subscription key was not found. Please contact support.', 'genesis-custom-blocks' );
				break;

			case 'product-unknown':
				$message = esc_html__( 'The product you requested information for is unknown. Please contact support.', 'genesis-custom-blocks' );
				break;

			default:
				$message = sprintf(
					/* translators: %1$s: Link to account portal. */
					esc_html__( 'There was an unknown error connecting to the update service. Please ensure the key you have saved here matches the key in your %1$s. This issue could be temporary. Please contact support if this error persists.', 'genesis-custom-blocks' ),
					$account_portal_link
				);
		}

		return sprintf( '<div class="notice notice-error"><p>%1$s</p></div>', $message );
	}
}
