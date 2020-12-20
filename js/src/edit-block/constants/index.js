/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/** typedef {} */

/** @typedef {null} NoFieldSelected The type when no field is selected. */

export const ALTERNATE_LOCATION = 'inspector';
export const BLOCK_NAMESPACE = 'genesis-custom-blocks';
export const BLOCK_PANEL = 'block';
export const BUILDER_EDITING_MODE = 'builder';
export const DEFAULT_LOCATION = 'editor';
export const EDITOR_PREVIEW_EDITING_MODE = 'editor';
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
/** @type {NoFieldSelected} */
export const NO_FIELD_SELECTED = null;
export const TEXT_ARRAY_DELIMITER = ' : ';
