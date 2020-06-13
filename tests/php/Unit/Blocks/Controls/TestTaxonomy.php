<?php
/**
 * Tests for class Taxonomy.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Taxonomy;
use Genesis\CustomBlocks\Blocks\Controls\ControlSetting;

/**
 * Tests for class Taxonomy.
 */
class TestTaxonomy extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of the extending class Taxonomy.
	 *
	 * @var Taxonomy
	 */
	public $instance;

	/**
	 * Instance of the setting.
	 *
	 * @var ControlSetting
	 */
	public $setting;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new Taxonomy();
		$this->setting  = new ControlSetting();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Taxonomy::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'taxonomy', $this->instance->name );
		$this->assertEquals( 'Taxonomy', $this->instance->label );
	}

	/**
	 * Test register_settings.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Taxonomy::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
			[
				'name'     => 'location',
				'label'    => 'Field Location',
				'type'     => 'location',
				'default'  => 'editor',
				'help'     => '',
				'sanitize' => [ $this->instance, 'sanitize_location' ],
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'width',
				'label'    => 'Field Width',
				'type'     => 'width',
				'default'  => '100',
				'help'     => '',
				'sanitize' => 'sanitize_text_field',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'help',
				'label'    => 'Help Text',
				'type'     => 'text',
				'default'  => '',
				'help'     => '',
				'sanitize' => 'sanitize_text_field',
				'validate' => '',
				'value'    => null,
			],
			[
				'name'     => 'post_type_rest_slug',
				'label'    => 'Taxonomy Type',
				'type'     => 'taxonomy_type_rest_slug',
				'default'  => 'posts',
				'help'     => '',
				'sanitize' => [ $this->instance, 'sanitize_taxonomy_type_rest_slug' ],
				'validate' => '',
				'value'    => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}

	/**
	 * Test render_settings_taxonomy_type_rest_slug.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Taxonomy::render_settings_taxonomy_type_rest_slug()
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::render_select()
	 */
	public function test_render_settings_taxonomy_type_rest_slug() {
		$name = 'post_type';
		$id   = 'bl_post_type';

		ob_start();
		$this->instance->render_settings_taxonomy_type_rest_slug( $this->setting, $name, $id );
		$output = ob_get_clean();
		$this->assertContains( $name, $output );
		$this->assertContains( $id, $output );

		foreach ( [ 'post_tag', 'category' ] as $post_type ) {
			$taxonomy = get_taxonomy( $post_type );
			$this->assertContains( $taxonomy->rest_base, $output );
			$this->assertContains( $taxonomy->label, $output );
		}
	}

	/**
	 * Test get_taxonomy_type_rest_slugs.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Taxonomy::get_taxonomy_type_rest_slugs()
	 */
	public function test_get_taxonomy_type_rest_slugs() {
		$new_tax_slug  = 'foo-new-tax';
		$new_tax_label = 'New Taxonomy';
		$rest_base     = 'foo-new-taxonomies';

		register_taxonomy(
			$new_tax_slug,
			'post',
			[
				'show_in_rest' => true,
				'label'        => $new_tax_label,
				'rest_base'    => $rest_base,
			]
		);

		// If a registered taxonomy doesn't have a rest_base, this should use the slug instead.
		$new_tax_slug_without_rest_base  = 'baz-new-tax';
		$new_tax_label_without_rest_base = 'Baz New Taxonomy';
		register_taxonomy(
			$new_tax_slug_without_rest_base,
			'page',
			[
				'show_in_rest' => true,
				'label'        => $new_tax_label_without_rest_base,
			]
		);

		$this->assertEquals(
			[
				'categories'                    => 'Categories',
				'tags'                          => 'Tags',
				$rest_base                      => $new_tax_label,
				$new_tax_slug_without_rest_base => $new_tax_label_without_rest_base,
			],
			$this->instance->get_taxonomy_type_rest_slugs()
		);
	}

	/**
	 * Test sanitize_taxonomy_type_rest_slug.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Taxonomy::sanitize_taxonomy_type_rest_slug()
	 */
	public function test_sanitize_taxonomy_type_rest_slug() {
		$invalid_taxonomy_type = 'baz_invalid_taxonomy';
		$valid_taxonomy_type   = 'categories';
		$this->assertEmpty( $this->instance->sanitize_taxonomy_type_rest_slug( $invalid_taxonomy_type ) );
		$this->assertEquals( $valid_taxonomy_type, $this->instance->sanitize_taxonomy_type_rest_slug( $valid_taxonomy_type ) );

		$location_taxonomy_type_slug = 'location';
		$rest_base                   = 'locations';
		register_taxonomy(
			$location_taxonomy_type_slug,
			'post',
			[
				'public'       => true,
				'show_in_rest' => true,
				'rest_base'    => $rest_base,
			]
		);

		// This should recognize the rest_base of the testimonial taxonomy type, even though it's different from its slug.
		$this->assertEquals( $rest_base, $this->instance->sanitize_taxonomy_type_rest_slug( $rest_base ) );
	}

	/**
	 * Test validate.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Taxonomy::validate()
	 */
	public function test_validate() {
		$expected_term = $this->factory()->tag->create_and_get();
		$valid_id      = $expected_term->term_id;
		$invalid_id    = 10000000;
		$term_name     = $expected_term->name;

		// When there's an invalid term ID, this should return null.
		$this->assertEquals( null, $this->instance->validate( [ 'id' => $invalid_id ], false ) );
		$this->assertEquals( $expected_term, $this->instance->validate( [ 'id' => $valid_id ], false ) );

		// If the ID is invalid, this should return ''.
		$this->assertEquals( '', $this->instance->validate( [ 'id' => $invalid_id ], true ) );
		$this->assertEquals( $term_name, $this->instance->validate( [ 'id' => $valid_id ], true ) );
	}
}
