/**
 * External dependencies
 */
const gulp = require( 'gulp' );
const run = require( 'gulp-run' );

gulp.task( 'install:dependencies', function() {
	return run( 'composer install -o --no-dev' ).exec();
} );

gulp.task( 'wporg:assets', function() {
	return run( 'mv package/prepare/assets/wporg/*.* package/assets' ).exec();
} );

gulp.task( 'create:zip', function() {
	return run( 'cp -r package/trunk package/genesis-custom-blocks; export BUILD_VERSION=$(grep "Version" genesis-custom-blocks.php | cut -f4 -d" "); cd package; pwd; zip -r genesis-custom-blocks.$BUILD_VERSION.zip genesis-custom-blocks/; echo "ZIP of build: $(pwd)/genesis-custom-blocks.$BUILD_VERSION.zip"; rm -rf genesis-custom-blocks' ).exec();
} );
