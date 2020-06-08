<?php
/**
 * Tests for BlockApi.php.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Loader;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use function Genesis\CustomBlocks\add_block;
use function Genesis\CustomBlocks\add_field;

/**
 * Tests for BlockApi.php.
 */
class TestBlockApi extends \WP_UnitTestCase {

	// Shows the assertions as passing.
	use MockeryPHPUnitIntegration;

	/**
	 * Teardown.
	 *
	 * @inheritdoc
	 */
	public function tearDown() {
		genesis_custom_blocks()->loader = new Loader();
		remove_all_filters( 'genesis_custom_blocks_default_fields' );
		remove_all_filters( 'genesis_custom_blocks_data_attributes' );
		remove_all_filters( 'genesis_custom_blocks_data_config' );

		parent::tearDown();
	}

	/**
	 * Test add_block.
	 *
	 * @covers \Genesis\CustomBlocks\add_block()
	 */
	public function test_add_block() {
		// Test calling this without the optional second argument.
		$block_name              = 'example-block';
		$expected_default_config = [
			'category' => 'common',
			'excluded' => [],
			'fields'   => [],
			'icon'     => 'block_lab',
			'keywords' => [],
			'name'     => $block_name,
			'title'    => 'Example Block',
		];

		$loader                         = Mockery::mock( Loader::class );
		genesis_custom_blocks()->loader = $loader;
		$loader->expects()->add_block( $expected_default_config );
		add_block( $block_name );

		// Test passing a $block_config, with a long name.
		$block_name   = 'this-is-a-long-block-name';
		$block_config = [
			'category' => 'example',
			'excluded' => [ 'baz', 'another' ],
			'fields'   => [ 'text' ],
			'icon'     => 'great_icon',
			'keywords' => [ 'hero', 'ad' ],
			'name'     => $block_name,
		];

		$expected_config = array_merge(
			$block_config,
			[ 'title' => 'This Is A Long Block Name' ]
		);
		$loader->expects()->add_block( $expected_config );
		add_block( $block_name, $block_config );
	}

	/**
	 * Test add_field.
	 *
	 * @covers \Genesis\CustomBlocks\add_field()
	 */
	public function test_add_field() {
		// Test calling this without the optional third argument.
		$block_name              = 'baz-block';
		$field_name              = 'another-field';
		$expected_default_config = [
			'control'  => 'text',
			'label'    => 'Another Field',
			'name'     => $field_name,
			'order'    => 0,
			'settings' => [],
		];

		$loader                         = Mockery::mock( Loader::class );
		genesis_custom_blocks()->loader = $loader;
		$loader->expects()->add_field( $block_name, $expected_default_config )->once();
		add_field( $block_name, $field_name );

		// Test passing a full $field_config.
		$block_name   = 'example-block-name-here';
		$field_name   = 'here_is_a_long_field_name';
		$field_config = [
			'control'  => 'rich_text',
			'label'    => 'Here Is Another Field',
			'order'    => 3,
			'settings' => [ 'foo' => 'baz' ],
		];

		$expected_field_config = array_merge(
			$field_config,
			[ 'name' => 'here-is-a-long-field-name' ]
		);

		$loader->expects()->add_field( $block_name, $expected_field_config )->once();
		add_field( $block_name, $field_name, $field_config );
	}
}
