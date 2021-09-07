/**
 * External dependencies
 */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { SlugSection } from '../../components';

global.gcbEditor = { categories: [] };
const mockChangeBlock = jest.fn();

jest.mock( '../../hooks/useBlock', () => {
	return jest.fn( () => ( {
		block: {},
		changeBlock: mockChangeBlock,
	} ) );
} );

describe( 'SlugSection', () => {
	it( 'converts an upper case slug to lower case', () => {
		const screen = render( <SlugSection /> );

		const upperCaseSlug = 'ExampleSlug';
		user.type( screen.getByRole( 'textbox' ), upperCaseSlug );
		expect( mockChangeBlock ).toBeCalledWith( { name: 'exampleslug' } );
	} );
} );
