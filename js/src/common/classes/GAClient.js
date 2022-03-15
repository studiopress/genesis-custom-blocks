/**
 * Internal dependencies
 */
import { debounce } from '../helpers';

// @ts-ignore
window.dataLayer = window.dataLayer || [];

/**
 * Genesis Analytics Client
 *
 * Forked from BMO's work in Genesis Blocks.
 *
 * Follows the singleton pattern to prevent multiple instances of the GA Client from being used.
 * https://developers.google.com/analytics/devguides/collection/gtagjs
 */
export default class GAClient {
	/**
	 * Is Google Analytics enabled.
	 *
	 * @type {boolean}
	 */
	enabled = false;

	/**
	 * Google Analytics Client
	 *
	 * @type {Object}
	 */
	client;

	/**
	 * Google Analytics Measurment ID.
	 *
	 * Todo: update this for GCB.
	 *
	 * @type {string}
	 */
	GA_ID = 'UA-12345';

	/**
	 * Class constructor.
	 */
	constructor() {
		this.client = function() {
			// @ts-ignore
			window.dataLayer.push( arguments );
		};

		// @ts-ignore
		this.config = window.gcbAnalyticsConfig || {};
		if ( this.config.ga_opt_in ) {
			this.enableAnalytics( this.config.ga_opt_in );
			this.initClient();
		}
	}

	/**
	 * Enables Google Analytics.
	 * Setting this value allows the GA Client to respect any opt out configuration.
	 *
	 * https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
	 *
	 * @param {boolean | number | string} enable The value to be set.
	 */
	enableAnalytics( enable ) {
		enable = !! +enable;

		if ( enable ) {
			// Remove ga-disable-GA_MEASUREMENT_ID property to enable GA.
			delete window[ `ga-disable-${ this.GA_ID }` ];
		} else {
			// Set ga-disable-GA_MEASUREMENT_ID property to disable GA.
			window[ `ga-disable-${ this.GA_ID }` ] = '1';
		}
		this.enabled = enable;
	}

	/**
	 * Sets up the initial values of the Google Analytics client.
	 */
	initClient() {
		this.client( 'js', new Date() );
		this.client( 'config', this.GA_ID, { send_page_view: false } );
	}

	/**
	 * Sends an event to Google Analytics.
	 *
	 * @param {string}                                          action
	 * @param {{event_category: string, event_label: [string]}} params
	 */
	send( action, params ) {
		if ( this.enabled ) {
			this.client( 'event', action, params );
		}
	}

	/**
	 * Creates a debounced copy of send method.
	 */
	sendDebounce = debounce( this.send.bind( this ), 500 );
}
