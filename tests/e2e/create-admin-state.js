/* eslint-disable no-console */
const { chromium } = require( '@playwright/test' );

/**
 * One-off helper script to create an authenticated storage state
 * for the WordPress admin user.
 *
 * Usage:
 *   WP_BASE_URL=http://localhost:8888 \
 *   WP_USERNAME=admin \
 *   WP_PASSWORD=password \
 *   node tests/e2e/create-admin-state.js
 *
 * This will write tests/e2e/storage-states/admin.json, which can then
 * be referenced from playwright.config.js via `use.storageState`.
 */
( async () => {
	const baseURL = process.env.WP_BASE_URL || 'http://localhost:8888';
	const username = process.env.WP_USERNAME || 'admin';
	const password = process.env.WP_PASSWORD || 'password';

	const browser = await chromium.launch();
	const context = await browser.newContext( { baseURL } );
	const page = await context.newPage();

	console.log( `Creating admin storage state for ${ baseURL } as ${ username }…` );

	// Go directly to the login screen and authenticate.
	await page.goto( '/wp-login.php' );
	await page.fill( '#user_login', username );
	await page.fill( '#user_pass', password );
	await page.click( '#wp-submit' );

	// Wait for the login redirect to complete, then confirm the admin bar is present.
	await page.waitForURL( '**/wp-admin/**', { timeout: 30000 } );
	await page.locator( '#wpadminbar' ).waitFor( { timeout: 30000 } );

	// Persist authenticated storage state for reuse in tests.
	await context.storageState( {
		path: 'tests/e2e/storage-states/admin.json',
	} );

	await browser.close();
	console.log( 'Saved storage state to tests/e2e/storage-states/admin.json' );
} )().catch( ( error ) => {
	console.error( 'Failed to create admin storage state:', error );
	process.exit( 1 );
} );
