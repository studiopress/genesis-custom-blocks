/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const EDITOR_LOCATION = 'editor';
export const INSPECTOR_LOCATION = 'inspector';

export const DEFAULT_LOCATION = EDITOR_LOCATION;
export const LOCATIONS = [ EDITOR_LOCATION, INSPECTOR_LOCATION ];
export const LOCATIONS_WITH_LABEL = [
	{
		value: EDITOR_LOCATION,
		label: __( 'Editor', 'genesis-custom-blocks' ),
	},
	{
		value: INSPECTOR_LOCATION,
		label: __( 'Inspector', 'genesis-custom-blocks' ),
	},
];
