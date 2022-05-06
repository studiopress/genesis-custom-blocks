<?php
/**
 * Tests for class Text.
 *
 * @package Genesis\CustomBlocks
 */

use Genesis\CustomBlocks\Blocks\Controls\Text;

/**
 * Tests for class Text.
 */
class TestText extends \WP_UnitTestCase {

	use TestingHelper;

	/**
	 * Instance of Text.
	 *
	 * @var Text
	 */
	public $instance;

	/**
	 * Setup.
	 *
	 * @inheritdoc
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Text();
	}

	/**
	 * Test __construct.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Text::__construct()
	 */
	public function test_construct() {
		$this->assertEquals( 'Text', $this->instance->label );
		$this->assertEquals( 'text', $this->instance->name );
	}

	/**
	 * Test register_settings.
	 *
	 * The parent constructor calls register_settings(), so there's no need to call it again here.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Text::register_settings()
	 */
	public function test_register_settings() {
		$expected_settings = [
			[
				'name'    => 'location',
				'label'   => 'Field Location',
				'type'    => 'location',
				'default' => 'editor',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'width',
				'label'   => 'Field Width',
				'type'    => 'width',
				'default' => '100',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'help',
				'label'   => 'Help Text',
				'type'    => 'text',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'default',
				'label'   => 'Default Value',
				'type'    => 'text',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'placeholder',
				'label'   => 'Placeholder Text',
				'type'    => 'text',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
			[
				'name'    => 'maxlength',
				'label'   => 'Character Limit',
				'type'    => 'number_non_negative',
				'default' => '',
				'help'    => '',
				'value'   => null,
			],
		];

		$this->assert_correct_settings( $expected_settings, $this->instance->settings );
	}

	/**
	 * Test jsonSerialize.
	 *
	 * @covers \Genesis\CustomBlocks\Blocks\Controls\Text::jsonSerialize()
	 */
	public function test_jsonSerialize() {
		$this->assertEquals(
			'{"name":"text","label":"Text","type":"string","settings":[{"name":"location","label":"Field Location","type":"location","default":"editor","help":"","value":null},{"name":"width","label":"Field Width","type":"width","default":"100","help":"","value":null},{"name":"help","label":"Help Text","type":"text","default":"","help":"","value":null},{"name":"default","label":"Default Value","type":"text","default":"","help":"","value":null},{"name":"placeholder","label":"Placeholder Text","type":"text","default":"","help":"","value":null},{"name":"maxlength","label":"Character Limit","type":"number_non_negative","default":"","help":"","value":null}],"locations":{"editor":"Editor","inspector":"Inspector"}}',
			wp_json_encode( $this->instance )
		);
	}
}
