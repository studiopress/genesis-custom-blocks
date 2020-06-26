<?php
/**
 * Handle Genesis Pro subscription.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license   http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Admin;

use Genesis\CustomBlocks\ComponentAbstract;

/**
 * Class Subscription
 */
class Subscription extends ComponentAbstract {

	/**
	 * Endpoint to validate the Genesis Pro subscription key.
	 *
	 * @var string
	 */
	const ENDPOINT = 'https://wp-product-info.wpesvc.net/v1/plugins/genesis-custom-blocks/subscriptions/';

	/**
	 * Settings group name for the subscription key.
	 *
	 * @var string
	 */
	const SUBSCRIPTION_KEY_SETTINGS_GROUP = 'genesis-custom-blocks-subscription-key';

	/**
	 * Option name where the subscription key is stored for this and other Genesis Pro plugins.
	 *
	 * @var string
	 */
	const SUBSCRIPTION_KEY_OPTION_NAME = 'genesis_pro_subscription_key';

	/**
	 * Transient name of the subscription key validation status.
	 *
	 * Stores the result of subscription validation, like 'valid'.
	 *
	 * @var string
	 */
	const SUBSCRIPTION_STATUS_TRANSIENT_NAME = 'genesis_custom_blocks_subscription';

	/**
	 * The transient value for when the request to validate the Pro subscription key failed.
	 *
	 * This is for when the actual request fails, like if the user has blocked requests.
	 * Not for when it returns that the subscription key is invalid.
	 *
	 * @var string
	 */
	const REQUEST_FAILED = 'request_failed';

	/**
	 * The transient value for when there was no error code in the subscription validation, but it was not still not valid.
	 *
	 * @var string
	 */
	const ERROR_UNKNOWN = 'unknown';

	/**
	 * The transient value saved if the subscription is valid.
	 *
	 * @var string
	 */
	const VALID = 'valid';

	/**
	 * The transient value for when subscription requests are locked.
	 *
	 * @var string
	 */
	const REQUESTS_LOCKED = 'subscription_requests_locked';

	/**
	 * The timeout of subscription requests, in seconds.
	 *
	 * @var int
	 */
	const REQUEST_TIMEOUT = 10;

	/**
	 * Adds the component filter.
	 */
	public function register_hooks() {
		add_filter( 'pre_update_option_' . self::SUBSCRIPTION_KEY_OPTION_NAME, [ $this, 'save_subscription_key' ] );
	}

	/**
	 * Checks that the subscription key is valid before saving.
	 *
	 * @param string $key The subscription key that was submitted.
	 *
	 * @return string|false
	 */
	public function save_subscription_key( $key ) {
		if ( empty( $key ) ) {
			genesis_custom_blocks()->admin->settings->prepare_notice( $this->subscription_empty_message() );
			delete_transient( self::SUBSCRIPTION_STATUS_TRANSIENT_NAME );
			return false;
		}

		$subscription_status = $this->activate_subscription( $key );
		if ( ! $this->is_valid() ) {
			$key = false;
			if ( self::REQUEST_FAILED === $subscription_status ) {
				genesis_custom_blocks()->admin->settings->prepare_notice( $this->subscription_request_failed_message() );
			} else {
				genesis_custom_blocks()->admin->settings->prepare_notice( $this->subscription_invalid_message( $subscription_status ) );
			}
		} else {
			genesis_custom_blocks()->admin->settings->prepare_notice( $this->subscription_success_message() );
		}

		return $key;
	}

	/**
	 * Checks if the subscription if valid.
	 *
	 * @return bool
	 */
	public function is_valid() {
		return self::VALID === $this->get_subscription_status();
	}

	/**
	 * Retrieves the subscription validation status.
	 *
	 * @return string|false The subscription validation status, or false if there's no subscription to validate.
	 */
	public function get_subscription_status() {
		$subscription_status = get_transient( self::SUBSCRIPTION_STATUS_TRANSIENT_NAME );

		if ( ! $subscription_status ) {
			$key = get_option( self::SUBSCRIPTION_KEY_OPTION_NAME );
			if ( ! empty( $key ) ) {
				$subscription_status = $this->activate_subscription( $key );
			}
		}

		return $subscription_status;
	}

	/**
	 * Tries to activate the subscription.
	 *
	 * @param string $key The subscription key to activate.
	 * @return string The subscription validation result.
	 */
	public function activate_subscription( $key ) {
		// If there's already a subscription validation request in progress,
		// prevent more requests that could create a stampede.
		if ( self::REQUESTS_LOCKED === get_transient( self::SUBSCRIPTION_STATUS_TRANSIENT_NAME ) ) {
			return self::REQUESTS_LOCKED;
		}

		set_transient( self::SUBSCRIPTION_STATUS_TRANSIENT_NAME, self::REQUESTS_LOCKED, self::REQUEST_TIMEOUT );
		$sanitized_key = preg_replace( '/[^A-Za-z0-9_-]/', '', $key );

		// Call the Genesis Custom Blocks API.
		$response = wp_remote_get(
			self::ENDPOINT . $sanitized_key,
			[ 'timeout' => self::REQUEST_TIMEOUT ]
		);

		if ( 200 === wp_remote_retrieve_response_code( $response ) ) {
			$subscription_status = self::VALID;
		} elseif ( is_wp_error( $response ) ) {
			$subscription_status = self::REQUEST_FAILED;
		} else {
			$response_body       = json_decode( wp_remote_retrieve_body( $response ) );
			$subscription_status = ! empty( $response_body->error_code ) ? $response_body->error_code : self::ERROR_UNKNOWN;
		}

		set_transient( self::SUBSCRIPTION_STATUS_TRANSIENT_NAME, $subscription_status, DAY_IN_SECONDS );

		return $subscription_status;
	}

	/**
	 * Admin notice for a subscription being empty, like ''.
	 *
	 * @return string The error notice for the subscription.
	 */
	public function subscription_empty_message() {
		return sprintf(
			'<div class="notice notice-error"><p>%1$s</p></div>',
			esc_html__( 'The subscription key was empty. Please enter a subscription key.', 'genesis-custom-blocks' )
		);
	}

	/**
	 * Admin notice for correct subscription details.
	 *
	 * @return string
	 */
	public function subscription_success_message() {
		return sprintf(
			'<div class="notice notice-success"><p>%1$s</p></div>',
			esc_html__( 'Your Genesis Pro subscription key was successfully activated!', 'genesis-custom-blocks' )
		);
	}

	/**
	 * Admin notice for the subscription request failing.
	 *
	 * This is for a rare case when the validation request fails entirely, like if the user has blocked requests.
	 * It's not for when it returns that the subscription key is invalid.
	 * This can help with debugging, as it'll point to whether the issue is related to WP or the subscription endpoint.
	 *
	 * @return string
	 */
	public function subscription_request_failed_message() {
		return sprintf(
			'<div class="notice notice-error"><p>%1$s</p></div>',
			__( 'There was a problem activating the subscription key, but it may not be invalid. If the problem persists, please contact support.', 'genesis-custom-blocks' )
		);
	}

	/**
	 * Admin notice for incorrect subscription details.
	 *
	 * Forked from Genesis Page Builder.
	 *
	 * @param string $error_code The error code from the endpoint.
	 * @return string The error message to display in the notice.
	 */
	public function subscription_invalid_message( $error_code ) {
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
