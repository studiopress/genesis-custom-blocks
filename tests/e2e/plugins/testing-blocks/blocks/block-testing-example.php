<?php
/**
 * Template for testing-example block to test the output of controls.
 *
 * @package Genesis\CustomBlocks
 */

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped

$field_names = [
	'testing-text',
	'testing-textarea',
	'testing-url',
	'testing-email',
	'testing-number',
	'testing-color',
	'testing-image',
	'testing-file',
	'testing-select',
	'testing-multiselect',
	'testing-toggle',
	'testing-range',
	'testing-checkbox',
	'testing-radio',
];

foreach ( $field_names as $field_name ) :
	printf(
		'Here is the result of calling block_value for %1$s: %2$s',
		$field_name,
		block_value( $field_name )
	);

	ob_start();
	block_field( $field_name );
	$block_field = ob_get_clean();

	printf(
		'Here is the result of calling block_field for %1$s: %2$s',
		$field_name,
		$block_field
	);
endforeach;
