/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { App } from './components';

// Renders the app in the container.
domReady( () => {
	let container = document.querySelector( 'body > div:first-child' );
	if ( ! container ) {
		container = document.querySelector( 'body' );
	}

	render(
		<App />,
		container
	);
} );
