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
import { GcbInspector } from '../';
import { addControls } from '../../helpers';

jest.mock( '@wordpress/block-editor', () => {
	const original = jest.requireActual( '@wordpress/block-editor' );
	return {
		...original,
		InspectorControls: ( { children } ) => children,
	};
} );

const getRangeField = ( location = 'editor' ) => ( {
	location,
	width: 100,
	help: 'This is help text',
	min: 0,
	max: 100,
	step: 1,
	default: undefined,
	name: 'range',
	label: 'Range',
	order: 0,
	control: 'range',
	type: 'integer',
} );

const getBlock = ( location = 'editor' ) => ( {
	name: 'test-range',
	title: 'Test Range',
	excluded: [],
	icon: 'genesis_custom_blocks',
	category: {
		icon: null,
		slug: 'text',
		title: 'Text',
	},
	keywords: [],
	fields: {
		range: getRangeField( location ),
	},
	displayModal: false,
} );

const getBlockProps = () => ( {
	attributes: {},
	setAttributes: () => {},
} );

describe( 'GcbInspector', () => {
	beforeEach( () => {
		addFilter( 'genesisCustomBlocks.controls', 'genesisCustomBlocks/addControls', addControls );
	} );
	it( 'displays the block in the inspector', () => {
		render(
			<GcbInspector
				block={ getBlock( 'inspector' ) }
				blockProps={ getBlockProps() }
			/>
		);

		expect( screen.getByText( getRangeField().label ) ).toBeInTheDocument();
	} );
} );
