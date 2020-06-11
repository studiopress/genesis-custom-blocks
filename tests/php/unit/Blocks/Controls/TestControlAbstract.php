<?php
/**
 * Tests for class ControlAbstract.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Number;
use Genesis\CustomBlocks\Blocks\Controls\ControlSetting;

/**
 * Tests for class ControlAbstract.
 */
class TestControlAbstract extends \WP_UnitTestCase {

	/**
	 * A mock name of the control.
	 *
	 * @var string
	 */
	const NAME = 'block-fields-settings[5c6c6bcf03d2c][default]';

	/**
	 * A mock ID of the control.
	 *
	 * @var string
	 */
	const ID = 'block-fields-edit-settings-number-default_5c6c6bcf03d2c';

	/**
	 * Instance of the extending class Number.
	 *
	 * @var Number
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
		$this->instance = new Number();
		$this->setting  = new ControlSetting();
	}

	/**
	 * Test create_settings_config.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::create_settings_config()
	 */
	public function test_create_settings_config() {
		$this->assertArraySubset(
			[
				'location'    => [
					'name'     => 'location',
					'label'    => __( 'Field Location', 'genesis-custom-blocks' ),
					'type'     => 'location',
					'default'  => 'editor',
					'sanitize' => [ $this->instance, 'sanitize_location' ],
				],
				'width'       => [
					'name'     => 'width',
					'label'    => __( 'Field Width', 'genesis-custom-blocks' ),
					'type'     => 'width',
					'default'  => '100',
					'sanitize' => 'sanitize_text_field',
				],
				'help'        => [
					'name'     => 'help',
					'label'    => __( 'Help Text', 'genesis-custom-blocks' ),
					'type'     => 'text',
					'default'  => '',
					'sanitize' => 'sanitize_text_field',
				],
				'default'     => [
					'name'     => 'default',
					'label'    => __( 'Default Value', 'genesis-custom-blocks' ),
					'type'     => 'text',
					'default'  => '',
					'sanitize' => 'sanitize_text_field',
				],
				'placeholder' => [
					'name'     => 'placeholder',
					'label'    => __( 'Placeholder Text', 'genesis-custom-blocks' ),
					'type'     => 'text',
					'default'  => '',
					'sanitize' => 'sanitize_text_field',
				],
			],
			$this->instance->settings_config
		);

		$this->assertArraySubset(
			[
				'editor'    => __( 'Editor', 'genesis-custom-blocks' ),
				'inspector' => __( 'Inspector', 'genesis-custom-blocks' ),
			],
			$this->instance->locations
		);
	}

	/**
	 * Test render_settings_number.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::render_settings_number()
	 */
	public function test_render_settings_number() {
		ob_start();
		$this->instance->render_settings_number( $this->setting, self::NAME, self::ID );
		$output = ob_get_clean();

		// This should not have a min="0" attribute.
		$this->assertNotContains( 'min="0"', $output );
		$this->assertContains( self::NAME, $output );
		$this->assertContains( self::ID, $output );
	}

	/**
	 * Test render_settings_number_non_negative.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::render_settings_number_non_negative()
	 */
	public function test_render_settings_number_non_negative() {
		ob_start();
		$this->instance->render_settings_number_non_negative( $this->setting, self::NAME, self::ID );
		$output = ob_get_clean();

		// This should have a min="0" attribute.
		$this->assertContains( 'min="0"', $output );
		$this->assertContains( self::NAME, $output );
		$this->assertContains( self::ID, $output );
	}

	/**
	 * Test render_number.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::render_number()
	 */
	public function test_render_number() {
		$min_attribute = 'min="0"';
		ob_start();
		$this->instance->render_number( $this->setting, self::NAME, self::ID );
		$output = ob_get_clean();

		// This should not have a min="0" attribute, as there is no 4th argument.
		$this->assertNotContains( $min_attribute, $output );

		ob_start();
		$this->instance->render_number( $this->setting, self::NAME, self::ID, true );
		$output = ob_get_clean();

		// This should  have a min="0" attribute, as the 4th argument is true.
		$this->assertContains( $min_attribute, $output );
	}

	/**
	 * Test render_select.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::render_select()
	 */
	public function test_render_select() {
		$options = [
			'foo' => 'One',
			'bar' => 'Two',
			'baz' => 'Three',
		];
		ob_start();
		$this->instance->render_select( $this->setting, self::NAME, self::ID, $options );
		$output = ob_get_clean();

		$this->assertContains( 'value="foo"', $output );
		$this->assertContains( 'value="bar"', $output );
		$this->assertContains( 'value="baz"', $output );
		$this->assertContains( 'One', $output );
		$this->assertContains( 'Two', $output );
		$this->assertContains( 'Three', $output );
	}

	/**
	 * Test render_settings_location.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::render_settings_location()
	 */
	public function test_render_settings_location() {
		ob_start();
		$this->instance->render_select( $this->setting, self::NAME, self::ID, $this->instance->locations );
		$output = ob_get_clean();

		$this->assertContains( 'value="editor"', $output );
		$this->assertContains( 'value="inspector"', $output );
		$this->assertContains( 'Editor', $output );
		$this->assertContains( 'Inspector', $output );
	}

	/**
	 * Test sanitize_location.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\ControlAbstract::sanitize_location()
	 */
	public function test_sanitize_location() {
		$wrong_locations = [ 'incorrect', 'classic-editor', 'foo-baz', false, null ];
		foreach ( $wrong_locations as $wrong_location ) {
			$this->assertEquals( null, $this->instance->sanitize_location( $wrong_location ) );
		}

		$correct_locations = [ 'editor', 'inspector' ];
		foreach ( $correct_locations as $correct_location ) {
			$this->assertEquals( $correct_location, $this->instance->sanitize_location( $correct_location ) );
		}
	}
}