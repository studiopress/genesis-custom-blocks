/**
 * External dependencies
 */
const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );

/**
 * Returns a FrameLocator for the iframe editor (WordPress 7.0+),
 * or the page itself for older WordPress versions.
 *
 * Both FrameLocator and Page expose .getByLabel(), .getByRole(),
 * .getByText(), and .locator() so callers need no branching.
 *
 * @param {import('@playwright/test').Page} page
 * @return {Promise<import('@playwright/test').FrameLocator|import('@playwright/test').Page>}
 */
async function getEditorCanvas( page ) {
	const iframe = page.locator( 'iframe[name="editor-canvas"]' );
	const count = await iframe.count();
	if ( count > 0 ) {
		return page.frameLocator( 'iframe[name="editor-canvas"]' );
	}
	return page;
}

/**
 * Uploads a media file via the WordPress media modal.
 *
 * @param {import('@playwright/test').Page}                                          page
 * @param {import('@playwright/test').FrameLocator|import('@playwright/test').Page} canvas
 * @param {string}                                                                   fieldLabel  ARIA label of the field that opens the media modal.
 * @param {string}                                                                   fileName    File name inside tests/e2e/assets/.
 * @return {Promise<number>} Random filename (without extension) used for the copy.
 */
async function uploadMediaFile( page, canvas, fieldLabel, fileName ) {
	await canvas.getByLabel( fieldLabel ).click();
	await page.locator( '.media-modal' ).waitFor();

	const testImagePath = path.join( __dirname, 'assets', fileName );
	const ext = path.extname( fileName );
	const newFileName = Math.floor( Math.random() * 100000 );
	const tmpPath = path.join( os.tmpdir(), `${ newFileName }${ ext }` );
	fs.copyFileSync( testImagePath, tmpPath );

	await page.locator( '.media-modal input[type=file]' ).setInputFiles( tmpPath );
	await page.locator( '.media-button-select:not([disabled])' ).click();

	return newFileName;
}

module.exports = { getEditorCanvas, uploadMediaFile };
