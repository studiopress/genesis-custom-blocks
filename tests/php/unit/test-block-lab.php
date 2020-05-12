<?php
/**
 * Test_Block_Lab
 *
 * @package GenesisCustomBlocks
 */

/**
 * Class Test_Block_Lab
 *
 * @package GenesisCustomBlocks
 */
class Test_Block_Lab extends \WP_UnitTestCase {
	/**
	 * Test block_lab_php_version_error().
	 *
	 * @covers \block_lab_php_version_error()
	 */
	public function test_block_lab_php_version_error() {
		ob_start();
		block_lab_php_version_error();
		$this->assertContains( '<div class="error">', ob_get_clean() );
	}

	/**
	 * Test block_lab_php_version_text().
	 *
	 * @covers \block_lab_php_version_text()
	 */
	public function test_block_lab_php_version_text() {
		$this->assertContains( 'Genesis Custom Blocks plugin error:', block_lab_php_version_text() );
	}

	/**
	 * Test block_lab_wp_version_error().
	 *
	 * @covers \block_lab_wp_version_error()
	 */
	public function test_block_lab_wp_version_error() {
		ob_start();
		block_lab_wp_version_error();

		$this->assertEquals(
			'<div class="error"><p>Genesis Custom Blocks plugin error: Your version of WordPress is too old. You must be running WordPress 5.0 to use Genesis Custom Blocks.</p></div>',
			ob_get_clean()
		);
	}

	/**
	 * Test block_lab_wp_version_text().
	 *
	 * @covers \block_lab_wp_version_text()
	 */
	public function test_block_lab_wp_version_text() {
		$this->assertEquals(
			'Genesis Custom Blocks plugin error: Your version of WordPress is too old. You must be running WordPress 5.0 to use Genesis Custom Blocks.',
			block_lab_wp_version_text()
		);
	}

	/**
	 * Test genesis_custom_blocks().
	 *
	 * @covers \genesis_custom_blocks()
	 */
	public function test_singleton() {
		$this->assertEquals( 'GenesisCustomBlocks\\Plugin', get_class( genesis_custom_blocks() ) );

		// Calling genesis_custom_blocks() twice should return the same instance.
		$this->assertEquals( genesis_custom_blocks(), genesis_custom_blocks() );
	}
}
