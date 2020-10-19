<?php
/**
 * Tests for class Loader.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Block;
use Genesis\CustomBlocks\Blocks\Field;
use Genesis\CustomBlocks\Blocks\Loader;

/**
 * Tests for class Loader.
 */
class TestLoader extends AbstractTemplate {

	/**
	 * The instance to test.
	 *
	 * @var Loader
	 */
	public $instance;

	/**
	 * A mock block config without a name.
	 *
	 * @var array
	 */
	private $block_config_without_name = [
		'foo' => 'Example Value',
	];

	/**
	 * A mock block config with a name.
	 *
	 * @var array
	 */
	private $block_config_with_name = [
		'name' => 'Example Block',
	];

	/**
	 * The REST API route for blocks.
	 *
	 * @var string
	 */
	private $rest_api_route = '/wp/v2/block-renderer/';

	/**
	 * A mock REST API handler.
	 *
	 * @var array
	 */
	private $mock_handler = [
		0 => [
			'methods'  => [ 'GET' ],
			'callback' => [ 'example_callback' ],
		],
	];

	/**
	 * The WP version with the correct 'block-renderer' endpoint.
	 *
	 * @see https://core.trac.wordpress.org/ticket/49680#comment:15
	 *
	 * @var string
	 */
	private $wp_version_with_correct_endpoint = '5.6';

	/**
	 * Tear down after each test.
	 *
	 * @inheritdoc
	 */
	public function tearDown() {
		remove_all_filters( 'genesis_custom_blocks_data' );
		parent::tearDown();
	}

	/**
	 * Test init.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::init()
	 */
	public function test_init() {
		$this->instance->init();
		$assets = $this->get_protected_property( 'assets' );
		$this->assertEquals( 'Genesis\\CustomBlocks\\Blocks\\Loader', get_class( $this->instance->init() ) );
		$this->assertContains( 'js/dist/block-editor.js', $assets['path']['entry'] );
		$this->assertContains( 'css/dist/blocks.editor.css', $assets['path']['editor_style'] );
		$this->assertContains( 'js/dist/block-editor.js', $assets['url']['entry'] );
		$this->assertContains( 'css/dist/blocks.editor.css', $assets['url']['editor_style'] );
	}

	/**
	 * Test register_hooks.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::register_hooks()
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals( 10, has_action( 'enqueue_block_editor_assets', [ $this->instance, 'editor_assets' ] ) );
		$this->assertEquals( 10, has_filter( 'block_categories', [ $this->instance, 'register_categories' ] ) );
		$this->assertEquals( 10, has_action( 'init', [ $this->instance, 'retrieve_blocks' ] ) );
		$this->assertEquals( 10, has_action( 'init', [ $this->instance, 'dynamic_block_loader' ] ) );
		$this->assertEquals( 10, has_filter( 'rest_endpoints', [ $this->instance, 'add_rest_method' ] ) );
	}

	/**
	 * Test get_data.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::get_data()
	 */
	public function test_get_data() {
		$config_key     = 'config';
		$attributes_key = 'attributes';

		// When the $data property is empty, get_data() should return false for any argument.
		$this->assertFalse( $this->instance->get_data( 'non-existent' ) );
		$this->assertFalse( $this->instance->get_data( $config_key ) );
		$this->assertFalse( $this->instance->get_data( $attributes_key ) );

		// With the 'config' set, this should return the 'config' when it's passed as an argument.
		$config = [ 'this' => 'that' ];
		$this->set_protected_property( 'data', [ $config_key => $config ] );
		$this->assertEquals( $config, $this->instance->get_data( $config_key ) );

		// The 'attributes' aren't present in the data, so this should return false.
		$this->assertFalse( $this->instance->get_data( $attributes_key ) );

		$attributes    = [ 'bar' => 'baz' ];
		$data_callback = static function( $data, $key ) use ( $attributes_key, $attributes ) {
			if ( $attributes_key === $key ) {
				return $attributes;
			}

			return $data;
		};
		add_filter( 'genesis_custom_blocks_data', $data_callback, 10, 2 );

		// The filter should change the return value.
		$this->assertEquals( $attributes, $this->instance->get_data( $attributes_key ) );
		remove_all_filters( 'genesis_custom_blocks_data' );

		$data_callback_for_key = static function( $data ) use ( $attributes ) {
			unset( $data );
			return $attributes;
		};
		$filter                = "genesis_custom_blocks_data_{$attributes_key}";
		add_filter( $filter, $data_callback_for_key );

		// The filter specific to the key should also change the return value.
		$this->assertEquals( $attributes, $this->instance->get_data( $attributes_key ) );
		remove_all_filters( $filter );
	}

	/**
	 * Test editor_assets.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::editor_assets()
	 */
	public function test_editor_assets() {
		$script_handle = 'genesis-custom-blocks-blocks';
		$style_handle  = 'genesis-custom-blocks-editor-css';

		$this->instance->init();
		$this->instance->editor_assets();

		$this->assertTrue( wp_script_is( $script_handle ) );
		$this->assertContains(
			'var genesisCustomBlocks = {"authorBlocks"',
			wp_scripts()->registered[ $script_handle ]->extra['data']
		);
		$this->assertContains(
			'const gcbBlocks =',
			wp_scripts()->registered[ $script_handle ]->extra['before'][1]
		);

		$this->assertTrue( wp_style_is( $style_handle ) );
	}

	/**
	 * Test render_block_template.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::render_block_template()
	 */
	public function test_render_block_template() {
		$slug       = 'gcb-testing-slug';
		$script_url = 'https://example.com/script.js';
		$block_name = 'test-image';
		$block      = new Block();

		$block->from_array( [ 'name' => $block_name ] );

		// Test that the do_action() call with this action runs, and that it allows enqueuing a script.
		add_action(
			'genesis_custom_blocks_render_template',
			function( $block ) use ( $block_name, $slug, $script_url ) {
				if ( $block_name === $block->name ) {
					wp_enqueue_script( $slug, $script_url, [], '0.1', true );
				}
			}
		);

		$this->invoke_protected_method( 'render_block_template', [ $block, [] ] );
		$scripts = wp_scripts();
		$script  = $scripts->registered[ $slug ];

		$this->assertTrue( in_array( $slug, $scripts->queue, true ) );
		$this->assertEquals( $slug, $script->handle );
		$this->assertEquals( $script_url, $script->src );

		// Test that the do_action() call with the dynamic name runs with an example slug.
		$slug       = 'foo-dynamic-testing-slug';
		$script_url = 'https://example.com/another-script.js';

		add_action(
			"genesis_custom_blocks_render_template_{$block_name}",
			function() use ( $block_name, $slug, $script_url ) {
				wp_enqueue_script( $slug, $script_url, [], '0.1', true );
			}
		);

		$this->invoke_protected_method( 'render_block_template', [ $block, [] ] );
		$scripts = wp_scripts();
		$script  = $scripts->registered[ $slug ];

		$this->assertTrue( in_array( $slug, $scripts->queue, true ) );
		$this->assertEquals( $slug, $script->handle );
		$this->assertEquals( $script_url, $script->src );
	}

	/**
	 * Test enqueue_block_styles.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::enqueue_block_styles()
	 */
	public function test_enqueue_block_styles() {
		$wp_styles    = wp_styles();
		$block_handle = "genesis-custom-blocks__block-{$this->mock_block_name}";

		// Check that the correct stylesheet is enqueued.
		foreach ( $this->get_template_css_paths() as $key => $file ) {
			$this->file_put_contents( $file, '' );
			$file_url = str_replace( untrailingslashit( ABSPATH ), '', $file );

			$this->invoke_protected_method( 'enqueue_block_styles', [ $this->mock_block_name, [ 'preview', 'block' ] ] );
			$this->assertContains( $block_handle, $wp_styles->queue );
			$this->assertArrayHasKey( $block_handle, $wp_styles->registered );
			$this->assertSame( $wp_styles->registered[ $block_handle ]->src, $file_url, "Trying to enqueue file #{$key} ({$file_url})." );

			wp_deregister_style( $block_handle );
			wp_dequeue_style( $block_handle );
		}

		// Check that nothing is enqueued if the file doesn't exist.
		$this->invoke_protected_method( 'enqueue_block_styles', [ 'does-not-exist', 'block' ] );
		$this->assertNotContains( $block_handle, $wp_styles->queue );
		$this->assertArrayNotHasKey( $block_handle, $wp_styles->registered );
	}

	/**
	 * Test get_block_attributes.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::get_block_attributes()
	 */
	public function test_get_block_attributes() {
		$taxonomy_name         = 'foo-taxonomy';
		$taxonomy_type         = 'taxonomy';
		$taxonomy_field_config = [
			'type' => $taxonomy_type,
		];

		$block = new Block();
		$block->from_array(
			[
				'fields' => [
					$taxonomy_name => $taxonomy_field_config,
				],
			]
		);

		$expected_attributes = [
			'className'    => [
				'type' => 'string',
			],
			$taxonomy_name => [
				'type' => $taxonomy_type,
			],
		];

		$actual_attributes = $this->invoke_protected_method( 'get_block_attributes', [ $block ] );
		$this->assertEquals( $expected_attributes, $actual_attributes );
	}

	/**
	 * Test get_attributes_from_field.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::get_attributes_from_field()
	 */
	public function test_get_attributes_from_field() {
		$image_name    = 'testing-image';
		$image_type    = 'image';
		$image_default = 'https://example/image';

		$image_field_config = [
			'type'    => $image_type,
			'default' => $image_default,
		];

		$image_field = new Field( $image_field_config );

		$actual_attributes_with_image = $this->invoke_protected_method( 'get_attributes_from_field', [ [], $image_name, $image_field ] );
		$this->assertEquals(
			[
				$image_name => [
					'default' => $image_default,
					'type'    => $image_type,
				],
			],
			$actual_attributes_with_image
		);
	}

	/**
	 * Test enqueue_global_styles.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::enqueue_global_styles()
	 */
	public function test_enqueue_global_styles() {
		$wp_styles          = wp_styles();
		$enqueue_handle     = 'genesis-custom-blocks__global-styles';
		$global_style_paths = [
			"{$this->theme_directory}/blocks/blocks.css",
			"{$this->theme_directory}/blocks/css/blocks.css",
		];

		// Check that the correct stylesheet is enqueued.
		foreach ( $global_style_paths as $key => $file ) {
			$this->file_put_contents( $file, '' );
			$file_url = str_replace( untrailingslashit( ABSPATH ), '', $file );

			$this->invoke_protected_method( 'enqueue_global_styles' );

			$this->assertContains( $enqueue_handle, $wp_styles->queue );
			$this->assertArrayHasKey( $enqueue_handle, $wp_styles->registered );
			$this->assertSame( $wp_styles->registered[ $enqueue_handle ]->src, $file_url, "Trying to enqueue file #{$key} ({$file_url})." );

			wp_deregister_style( $enqueue_handle );
			wp_dequeue_style( $enqueue_handle );
			unlink( $file );
		}
	}

	/**
	 * Test block_template.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::block_template()
	 */
	public function test_block_template() {
		ob_start();
		$this->invoke_protected_method( 'block_template', [ $this->mock_block_name ] );

		// If there is no template and the user does not have 'edit_posts' permissions, this should not output anything.
		$this->assertEmpty( ob_get_clean() );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
		ob_start();
		$this->invoke_protected_method( 'block_template', [ $this->mock_block_name ] );
		$output = ob_get_clean();

		// There is still no template, but the user has the correct permissions, so this should output a warning.
		$this->assertContains( '<div class="notice notice-warning">', $output );
		$this->assertContains( $this->mock_block_name, $output );
		$this->assertContains( 'not found', $output );

		/*
		 * Test that the templates are used in the proper priority.
		 * This reverses the order of the $this->get_template_paths_in_theme(),
		 * as they were originally in order of descending priority.
		 * So in each iteration, the template should have a higher priority than the last, and should be used as the template.
		 * The templates won't be deleted until the tearDown() method after this test.
		 */
		$templates_in_parent_theme = array_reverse( $this->get_template_paths_in_theme() );
		foreach ( $templates_in_parent_theme as $template_location ) {
			$expected_template_contents = "This is content in the template {$template_location}";
			$this->file_put_contents( $template_location, $expected_template_contents );

			ob_start();
			$this->invoke_protected_method( 'block_template', [ $this->mock_block_name ] );
			$this->assertContains( $expected_template_contents, ob_get_clean() );
		}

		$overridden_theme_template_path       = "{$this->theme_directory}/example-overridden-template.php";
		$expected_overriden_template_contents = "This is content in the template {$overridden_theme_template_path}";
		$this->file_put_contents( $overridden_theme_template_path, $expected_overriden_template_contents );

		// Test that this filter changes the template used.
		add_filter(
			'genesis_custom_blocks_override_theme_template',
			function( $directory ) use ( $overridden_theme_template_path ) {
				unset( $directory );
				return $overridden_theme_template_path;
			}
		);

		ob_start();
		$this->invoke_protected_method( 'block_template', [ $this->mock_block_name ] );
		$this->assertContains( $expected_overriden_template_contents, ob_get_clean() );
	}

	/**
	 * Test add_block.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::add_block()
	 */
	public function test_add_block() {
		// The block config does not have a name, so it should not be added to the $blocks property.
		$this->instance->add_block( $this->block_config_without_name );
		$this->assertEmpty( $this->get_protected_property( 'blocks' ) );

		// Now that the block config has a name, it should be added to the $blocks property.
		$this->instance->add_block( $this->block_config_with_name );
		$actual_blocks = $this->get_protected_property( 'blocks' );
		$this->assertEquals(
			$this->block_config_with_name,
			$actual_blocks[ "genesis-custom-blocks/{$this->block_config_with_name['name']}" ]
		);
	}

	/**
	 * Test add_field.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::add_field()
	 */
	public function test_add_field() {
		$block_name                = 'example-block';
		$full_block_name           = "genesis-custom-blocks/{$block_name}";
		$field_name                = 'baz-field';
		$field_config_with_name    = [ 'name' => $field_name ];
		$field_config_without_name = [ 'baz' => 'example' ];

		// The block does not exist in the $blocks property, so this should not add anything to it.
		$this->instance->add_field( $block_name, $field_config_with_name );
		$this->assertEmpty( $this->get_protected_property( 'blocks' ) );

		// The second argument doesn't have a 'name' value, so this shouldn't add anything to the $blocks property.
		$this->instance->add_field( $block_name, $field_config_without_name );
		$this->assertEmpty( $this->get_protected_property( 'blocks' ) );

		// Now that the block name exists in the $blocks property, this should add the field to it.
		$this->set_protected_property( 'blocks', [ $full_block_name => [] ] );
		$this->instance->add_field( $block_name, $field_config_with_name );
		$actual_blocks = $this->get_protected_property( 'blocks' );
		$this->assertEquals(
			$field_config_with_name,
			$actual_blocks[ $full_block_name ]['fields'][ $field_name ]
		);
	}

	/**
	 * Test add_rest_method when there is no GCB block.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::add_rest_method()
	 */
	public function test_add_rest_method_no_gcb_block() {
		$initial_methods     = [ 'GET' ];
		$non_gcb_block_route = $this->rest_api_route . '(?P<name>different-block-namespace/main-hero)';
		$actual              = $this->instance->add_rest_method(
			[
				$non_gcb_block_route => [
					0 => [
						'methods'  => $initial_methods,
						'callback' => '__return_false',
					],
				],
			]
		);

		$this->assertEquals(
			[
				'methods'  => $initial_methods,
				'callback' => '__return_false',
			],
			$actual[ $non_gcb_block_route ][0]
		);
	}

	/**
	 * Test add_rest_method when there is a GCB block.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::add_rest_method()
	 */
	public function test_add_rest_method_with_gcb_block() {
		$expected_methods = [ 'GET', 'POST' ];
		$gcb_block_route  = $this->rest_api_route . '(?P<name>genesis-custom-blocks/main-hero)';
		$initial_routes   = [
			$gcb_block_route => $this->mock_handler,
		];

		if ( is_wp_version_compatible( $this->wp_version_with_correct_endpoint ) ) {
			$initial_routes[ $gcb_block_route ]['methods'] = $expected_methods;
		}

		$actual = $this->instance->add_rest_method( $initial_routes );
		$this->assertEquals(
			[
				'methods'  => $expected_methods,
				'callback' => $this->mock_handler[0]['callback'],
			],
			$actual[ $gcb_block_route ][0]
		);
	}

	/**
	 * Gets the full paths of the template CSS files, in order of reverse priority.
	 *
	 * @return array The paths of the template CSS files.
	 */
	public function get_template_css_paths() {
		return [
			"{$this->theme_directory}/blocks/block-{$this->mock_block_name}.css",
			"{$this->theme_directory}/blocks/css/block-{$this->mock_block_name}.css",
			"{$this->theme_directory}/blocks/{$this->mock_block_name}/block.css",
			"{$this->theme_directory}/blocks/preview-{$this->mock_block_name}.css",
			"{$this->theme_directory}/blocks/css/preview-{$this->mock_block_name}.css",
			"{$this->theme_directory}/blocks/{$this->mock_block_name}/preview.css",
		];
	}
}
