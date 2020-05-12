<?php
/**
 * Repeater control.
 *
 * @package   GenesisCustomBlocks
 * @copyright Copyright(c) 2020, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace GenesisCustomBlocks\Blocks\Controls;

/**
 * Class Repeater
 */
class Repeater extends Control_Abstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'repeater';

	/**
	 * Field variable type.
	 *
	 * The Repeater control is an array of objects, with each row being an object.
	 * For example, a repeater with one row might be [ { 'example-text': 'Foo', 'example-image': 4232 } ].
	 *
	 * @var string
	 */
	public $type = 'object';

	/**
	 * Repeater constructor.
	 */
	public function __construct() {
		parent::__construct();
		$this->label = __( 'Repeater', 'genesis-custom-blocks' );
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		$this->settings[] = new Control_Setting( $this->settings_config['help'] );
		$this->settings[] = new Control_Setting(
			[
				'name'     => 'min',
				'label'    => __( 'Minimum Rows', 'genesis-custom-blocks' ),
				'type'     => 'number_non_negative',
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
		$this->settings[] = new Control_Setting(
			[
				'name'     => 'max',
				'label'    => __( 'Maximum Rows', 'genesis-custom-blocks' ),
				'type'     => 'number_non_negative',
				'sanitize' => [ $this, 'sanitize_number' ],
			]
		);
	}

	/**
	 * Remove empty placeholder rows.
	 *
	 * @param mixed $value The value to either make available as a variable or echoed on the front-end template.
	 * @param bool  $echo Whether this will be echoed.
	 * @return mixed $value The value to be made available or echoed on the front-end template.
	 */
	public function validate( $value, $echo ) {
		if ( isset( $value['rows'] ) ) {
			foreach ( $value['rows'] as $key => $row ) {
				unset( $value['rows'][ $key ][''] );
				unset( $value['rows'][ $key ][0] );
			}
		}

		if ( $echo && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			$value = sprintf(
				// translators: Placeholders are the opening and closing anchor tags of a link.
				__( '⚠️ Please use Genesis Custom Blocks\'s %1$srepeater functions%2$s to display repeater fields in your template.', 'genesis-custom-blocks' ),
				'<a href="https://getblocklab.com/docs/fields/repeater/">',
				'</a>'
			);
		}

		return $value;
	}
}
