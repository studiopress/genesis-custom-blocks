<?php
/**
 * A mock template in the template editor, testing all fields.
 *
 * @package Genesis\CustomBlocks
 */

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaping could interfere with testing this template output.

$fields = [
	'textarea',
	'url',
	'email',
	'number',
	'color',
	'image',
	'select',
	'toggle',
	'range',
	'checkbox',
	'radio',
	'text',
	'multiselect',
];

ob_start();

foreach ( $fields as $field ) :
	?>
	<p>
		<?php
		printf(
			'Here is the result for %1$s: %2$s',
			$field,
			'{{' . $field . '}}'
		);
		?>
	</p>
	<?php
endforeach;

echo 'Here are escaped brackets: \{\{example\}\}';

return ob_get_clean();
