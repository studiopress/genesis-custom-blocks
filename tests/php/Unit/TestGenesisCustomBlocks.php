<?php
/**
 * TestGenesisCustomBlocks
 *
 * @package Genesis\CustomBlocks
 */

/**
 * Class TestGenesisCustomBlocks
 *
 * @package Genesis\CustomBlocks
 */
class TestGenesisCustomBlocks extends \WP_UnitTestCase {

	/**
	 * Test genesis_custom_blocks().
	 *
	 * @covers \genesis_custom_blocks()
	 */
	public function test_singleton() {
		$this->assertEquals( 'Genesis\CustomBlocks\\Plugin', get_class( genesis_custom_blocks() ) );

		// Calling genesis_custom_blocks() twice should return the same instance.
		$this->assertEquals( genesis_custom_blocks(), genesis_custom_blocks() );
	}
}
