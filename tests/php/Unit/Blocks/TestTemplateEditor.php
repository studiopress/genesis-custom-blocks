<?php
/**
 * Tests for class TemplateEditor.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\TemplateEditor;

/**
 * Tests for class TemplateEditor.
 */
class TestTemplateEditor extends WP_UnitTestCase {

	/**
	 * The instance to test.
	 *
	 * @var TemplateEditor
	 */
	public $instance;

	/**
	 * Sets up before each test.
	 *
	 * @inheritdoc
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new TemplateEditor();
	}

	/**
	 * Test render_css when there is no CSS to render.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\TemplateEditor::render_css()
	 */
	public function test_render_css_empty_css() {
		ob_start();
		$this->instance->render_css( '', 'example-block' );

		$this->assertEmpty( ob_get_clean() );
	}

	/**
	 * Test render_css with 2 of the same block name.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\TemplateEditor::render_css()
	 */
	public function test_render_css_same_block_name() {
		$block_name = 'example-block';
		$css        = '.baz { display: block; }';

		ob_start();
		$this->instance->render_css( $css, $block_name );

		$this->assertStringContainsString( "<style>{$css}</style>", ob_get_clean() );

		ob_start();
		$this->instance->render_css( $css, $block_name );

		// Once this has rendered the <style> for this block name, it shouldn't render it again.
		$this->assertEmpty( ob_get_clean() );
	}

	/**
	 * Test render_css when there are 2 different block names.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\TemplateEditor::render_css()
	 */
	public function test_render_css_different_block_names() {
		$first_block_name  = 'text-block';
		$first_css         = '.gcb-text { background-color: #000000; }';
		$second_block_name = 'url-block';
		$second_css        = '.gcb-url { background-color: #742b2b; }';

		ob_start();
		$this->instance->render_css( $first_css, $first_block_name );

		$this->assertStringContainsString( "<style>{$first_css}</style>", ob_get_clean() );

		ob_start();
		$this->instance->render_css( $second_css, $second_block_name );

		$this->assertStringContainsString( "<style>{$second_css}</style>", ob_get_clean() );
	}
}
