// @ts-check

/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * The migration admin page.
 *
 * @return {React.ReactElement} The component for the admin page.
 */
const App = () => {
	return <span>{ __( 'This is the Edit Block UI', 'genesis-custom-blocks' ) }</span>;
};

export default App;
