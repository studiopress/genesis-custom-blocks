/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const ALTERNATE_LOCATION = 'inspector';
export const BLOCK_NAMESPACE = 'genesis-custom-blocks';
export const BLOCK_PANEL = 'block';
export const DEFAULT_LOCATION = 'editor';
export const FIELD_PANEL = 'field';
export const LOCATIONS = [ DEFAULT_LOCATION, 'inspector' ];
export const LOCATIONS_WITH_LABEL = [
	{
		value: DEFAULT_LOCATION,
		label: __( 'Editor', 'genesis-custom-blocks' ),
	},
	{
		value: ALTERNATE_LOCATION,
		label: __( 'Inspector', 'genesis-custom-blocks' ),
	},
];
export const TEXT_ARRAY_DELIMITER = ' : ';
