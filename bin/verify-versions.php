#!/usr/bin/env php
<?php
/**
 * Verify versions referenced in plugin match.
 *
 * Forked from the AMP Plugin for WordPress
 *
 * @see https://github.com/ampproject/amp-wp/blob/dce58640f7c36befda67b145d00ec4f40c2278eb/bin/verify-version-consistency.php
 *
 * phpcs:ignoreFile
 * @package Genesis\CustomBlocks
 */

if ( 'cli' !== php_sapi_name() ) {
	fwrite( STDERR, "Must run from CLI.\n" );
	exit( 1 );
}

$versions = [];

$plugin_file = file_get_contents( dirname( __FILE__ ) . '/../genesis-custom-blocks.php' );
if ( ! preg_match( '/\*\s*Version:\s*(?P<version>\d+\.\d+(?:.\d+)?(-\w+)?)/', $plugin_file, $matches ) ) {
	echo "Could not find version in main plugin file metadata\n";
	exit( 1 );
}
$versions['genesis-custom-blocks.php#metadata'] = $matches['version'];
$version_number = $matches['version'];

$package_json             = json_decode( file_get_contents( dirname( __FILE__ ) . '/../package.json' ) );
$versions['package.json'] = $package_json->version;

fwrite( STDERR, "Version references:\n" );

echo json_encode( $versions, JSON_PRETTY_PRINT ) . "\n";

if ( 1 !== count( array_unique( $versions ) ) ) {
	fwrite( STDERR, "Error: Not all version references have been updated.\n" );
	exit( 1 );
}

if ( false === strpos( $version_number, '-' ) && ! preg_match( '/^\d+\.\d+\.\d+$/', $version_number ) ) {
	fwrite( STDERR, sprintf( "Error: Release version (%s) lacks patch number. For new point releases, supply patch number of 0, such as 0.9.0 instead of 0.9.\n", $version_number ) );
	exit( 1 );
}

$changelog = file_get_contents( dirname( __FILE__ ) . '/../CHANGELOG.md' );
if ( false === strpos( $changelog, $version_number ) ) {
	fwrite( STDERR, sprintf( "Error: The CHANGELOG.md doesn't have an entry for this release version (%s).\n", $version_number ) );
	exit( 1 );
}

fwrite( STDOUT, "Success! All of the version numbers are the same, and there's a CHANGELOG.md entry. \n" );
