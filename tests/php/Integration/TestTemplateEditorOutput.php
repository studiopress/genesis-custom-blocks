<?php
/**
 * TestTemplateEditorOutput
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Block;
use Genesis\CustomBlocks\PostTypes\BlockPost;

/**
 * Class TestTemplateEditorOutput
 *
 * @package Genesis\CustomBlocks
 */
class TestTemplateEditorOutput extends AbstractAttribute {

	/**
	 * Fields that don't fit well into the other test groups.
	 *
	 * @var array
	 */
	public $special_case_fields;

	/**
	 * Sets up before each test.
	 *
	 * @inheritdoc
	 */
	public function setUp() {
		parent::setUp();

		$this->set_properties();
	}

	/**
	 * Sets class properties.
	 */
	public function set_properties() {
		$this->block_name = 'template-editor-rendered';

		$this->attributes = [
			'className'   => $this->class_name,
			'checkbox'    => true,
			'text'        => 'Here is a text field',
			'textarea'    => 'And here is something',
			'url'         => 'https://yourdomain.com/entered',
			'email'       => 'entered@email.com',
			'number'      => 15134,
			'color'       => '#777444',
			'image'       => $this->get_image_attribute(),
			'select'      => 'foo',
			'multiselect' => [ 'foo' ],
			'toggle'      => true,
			'range'       => 7,
			'radio'       => 'baz',
		];

		$this->string_fields = [
			'text',
			'textarea',
			'url',
			'email',
			'number',
			'color',
			'select',
			'range',
			'radio',
		];

		$this->object_fields = [
			'multiselect',
		];

		$image                     = wp_get_attachment_image_src( $this->attributes['image'], 'full' );
		$this->special_case_fields = [
			'checkbox' => [
				'block_field' => 'Yes',
				'block_value' => 1,
			],
			'image'    => [
				'block_field' => isset( $image[0] ) ? $image[0] : '',
				'block_value' => $this->attributes['image'],
			],
			'toggle'   => [
				'block_field' => 'Yes',
				'block_value' => 1,
			],
		];
	}

	/**
	 * Gets the block config.
	 *
	 * @return array The config for the block.
	 */
	public function get_block_config() {
		$block_post = new BlockPost();
		$fields     = [];

		$all_fields = array_merge(
			$this->string_fields,
			$this->object_fields,
			$this->special_case_field_names
		);

		foreach ( $all_fields as $field_name ) {
			$control_name          = str_replace( '-', '_', $field_name );
			$control               = $block_post->get_control( $control_name );
			$fields[ $field_name ] = [
				'control' => str_replace( '-', '_', $field_name ),
				'name'    => $control_name,
				'type'    => $control->type,
			];
		}

		return [
			'category'       => [
				'icon'  => null,
				'slug'  => '',
				'title' => '',
			],
			'excluded'       => [],
			'fields'         => $fields,
			'icon'           => 'genesis_custom_blocks',
			'keywords'       => [ '' ],
			'name'           => $this->block_name,
			'title'          => 'Template Editor Rendered',
			'templateMarkup' => require __DIR__ . '/Fixtures/template-editor.php',
		];
	}

	/**
	 * Tests whether the rendered block template has the expected values.
	 *
	 * Every field is tested.
	 * This sets mock block attributes, like those that would be saved from a block.
	 * Then, it loads the mock template in the theme's blocks/ directory,
	 * and ensures that all of these fields appear correctly in it.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\TemplateEditor::render()
	 * @covers \Genesis\CustomBlocks\Blocks\Loader::render_block_template()
	 */
	public function test_block_template() {
		$block        = new Block();
		$block_config = $this->get_block_config();
		$block->from_array( $block_config );

		add_filter(
			'genesis_custom_blocks_available_blocks',
			static function( $blocks ) use ( $block, $block_config ) {
				return array_merge(
					$blocks,
					[ "genesis-custom-blocks/{$block->name}" => $block_config ]
				);
			}
		);

		genesis_custom_blocks()->loader->retrieve_blocks();
		$rendered_template = $this->invoke_protected_method( genesis_custom_blocks()->loader, 'render_block_template', [ $block, $this->attributes ] );
		$actual_template   = str_replace( [ "\t", "\n" ], '', $rendered_template );

		// Test the fields that return a string for block_value().
		foreach ( $this->string_fields as $field ) {
			$this->assertContains(
				sprintf(
					'Here is the result for %1$s: %2$s',
					$field,
					$this->attributes[ $field ]
				),
				$actual_template
			);
		}

		// Test the fields that don't fit well into the tests above.
		foreach ( $this->special_case_fields as $field_name => $expected ) {
			$this->assertContains(
				sprintf(
					'Here is the result for %1$s: %2$s',
					$field_name,
					$expected['block_field']
				),
				$actual_template
			);
		}
	}
}
