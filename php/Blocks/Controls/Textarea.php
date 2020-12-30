<?php
/**
 * Textarea control.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks\Blocks\Controls;

/**
 * Class Textarea
 */
class Textarea extends ControlAbstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'textarea';

	/**
	 * Field variable type.
	 *
	 * @var string
	 */
	public $type = 'string';

	/**
	 * Textarea constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->label = __( 'Textarea', 'genesis-custom-blocks' );
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		foreach ( [ 'location', 'width', 'help' ] as $setting ) {
			$this->settings[] = new ControlSetting( $this->settings_config[ $setting ] );
		}

		$this->settings[] = new ControlSetting(
			[
				'name'     => 'default',
				'label'    => __( 'Default Value', 'genesis-custom-blocks' ),
				'type'     => 'textarea',
				'default'  => '',
				'sanitize' => 'sanitize_textarea_field',
			]
		);
		$this->settings[] = new ControlSetting( $this->settings_config['placeholder'] );
		$this->settings[] = new ControlSetting(
			[
				'name'     => 'maxlength',
				'label'    => __( 'Character Limit', 'genesis-custom-blocks' ),
				'type'     => 'number_non_negative',
				'default'  => '',
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
		$this->settings[] = new ControlSetting(
			[
				'name'     => 'number_rows',
				'label'    => __( 'Number of Rows', 'genesis-custom-blocks' ),
				'type'     => 'number_non_negative',
				'default'  => 4,
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
		$this->settings[] = new ControlSetting(
			[
				'name'     => 'new_lines',
				'label'    => __( 'New Lines', 'genesis-custom-blocks' ),
				'type'     => 'new_line_format',
				'default'  => 'autop',
				'sanitize' => [ $this, 'sanitize_new_line_format' ],
			]
		);
	}

	/**
	 * Renders a <select> of new line rendering formats.
	 *
	 * @param ControlSetting $setting The ControlSetting being rendered.
	 * @param string         $name    The name attribute of the option.
	 * @param string         $id      The id attribute of the option.
	 *
	 * @return void
	 */
	public function render_settings_new_line_format( $setting, $name, $id ) {
		$formats = $this->get_new_line_formats();
		$this->render_select( $setting, $name, $id, $formats );
	}

	/**
	 * Gets the new line formats.
	 *
	 * @return array {
	 *     An associative array of new line formats.
	 *
	 *     @type string $key    The option value to save.
	 *     @type string $label  The label.
	 * }
	 */
	public function get_new_line_formats() {
		$formats = [
			'autop'  => __( 'Automatically add paragraphs', 'genesis-custom-blocks' ),
			'autobr' => __( 'Automatically add line breaks', 'genesis-custom-blocks' ),
			'none'   => __( 'No formatting', 'genesis-custom-blocks' ),
		];
		return $formats;
	}

	/**
	 * Sanitize the new line format, to ensure that it's valid.
	 *
	 * @param string $value The format to sanitize.
	 * @return string|null The sanitized rest_base of the post type, or null.
	 */
	public function sanitize_new_line_format( $value ) {
		if ( is_string( $value ) && array_key_exists( $value, $this->get_new_line_formats() ) ) {
			return $value;
		}
		return null;
	}
}
