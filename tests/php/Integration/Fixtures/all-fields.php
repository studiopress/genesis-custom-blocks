<?php
/**
 * A mock template for a block, testing all fields.
 *
 * @package Genesis\CustomBlocks
 */

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaping could interfere with testing block_value().

$non_object_fields = [
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
];

foreach ( $non_object_fields as $field ) :
	?>
	<p class="<?php block_field( 'className' ); ?>">
		<?php
		printf(
			'Here is the result of block_field() for %s: ',
			$field
		);
		block_field( $field );
		?>
	</p>

	<p>
		<?php
		printf(
			'Here is the result of calling block_value() for %s: %s',
			$field,
			block_value( $field )
		);
		?>
	</p>
	<?php
endforeach;

echo 'Here is the result of block_field() for multiselect: ';
block_field( 'multiselect' );
