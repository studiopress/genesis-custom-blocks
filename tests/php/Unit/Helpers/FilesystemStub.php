<?php
/**
 * Stub for filesystem.
 *
 * @package Genesis\CustomBlocks
 */

/**
 * Stub for filesystem.
 */
class FilesystemStub {
	/**
	 * Gets contents.
	 *
	 * @param string $file File name.
	 */
	public function get_contents( $file ) {
		return file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	}

	/**
	 * Creates a directory.
	 *
	 * @param string    $path  The path.
	 * @param int|false $chmod The permissions.
	 */
	public function mkdir( $path, $chmod ) {}

	/**
	 * Puts the contents.
	 *
	 * @param string $file     Remote path.
	 * @param string $contents The contents.
	 */
	public function put_contents( $file, $contents ) {}
}
