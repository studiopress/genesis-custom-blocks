/**
 * External dependencies
 */
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { render, screen } from '@testing-library/react';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { Fields } from '../';
import { addControls } from '../../helpers';

const helpText = 'This is help text';
describe( 'Fields', () => {
	it( 'does not display a control that is supposed to be in the Inspector Controls', () => {
		render(
			<Fields
				fields={ [ {
					name: 'example_email',
					help: helpText,
					location: 'inspector',
					control: 'email',
				} ] }
				parentBlockProps={ {} }
			/>
		);

		expect( screen.queryByText( helpText ) ).not.toBeInTheDocument();
	} );

	it( 'displays a control that is supposed to be in the editor', () => {
		addFilter( 'genesisCustomBlocks.controls', 'genesisCustomBlocks/addControls', addControls );
		render(
			<Fields
				fields={ [ {
					name: 'example_email',
					help: helpText,
					location: 'editor',
					control: 'email',
				} ] }
				parentBlockProps={ {} }
			/>
		);

		expect( screen.getByText( helpText ) ).toBeInTheDocument();
	} );

	it( 'has a class name based on the width', () => {
		render(
			<Fields
				fields={ [ {
					name: 'example_email',
					width: '50',
					help: helpText,
					location: 'editor',
					control: 'email',
				} ] }
				parentBlockProps={ {} }
			/>
		);

		const classWithWidth = 'width-50';
		expect( document.body.getElementsByClassName( classWithWidth )[ 0 ] ).not.toBeNull();
	} );
} );
