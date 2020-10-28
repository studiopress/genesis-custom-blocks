/**
 * External dependencies
 */
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import FieldSettings from '../field-settings';

describe( 'FieldSettings', () => {
	it( 'has the label', () => {
		render( <FieldSettings /> );
		expect( screen.queryByText( /Field Settings/ ) ).toBeInTheDocument();
	} );
} );
