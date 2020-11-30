/**
 * Internal dependencies
 */
import { getWidthClass } from '../';

describe( 'getWidthClass', () => {
	it.each( [
		[
			'25',
			'col-span-1',
		],
		[
			'50',
			'col-span-2',
		],
		[
			'75',
			'col-span-3',
		],
		[
			'100',
			'col-span-4',
		],
		[
			25,
			'col-span-1',
		],
		[
			50,
			'col-span-2',
		],
		[
			75,
			'col-span-3',
		],
		[
			100,
			'col-span-4',
		],
		[
			undefined,
			'col-span-4',
		],
		[
			null,
			'col-span-4',
		],
		[
			'28',
			'col-span-1',
		],
		[
			53,
			'col-span-2',
		],
		[
			78,
			'col-span-3',
		],
		[
			102,
			'col-span-4',
		],
	] )( 'should return the class of the width',
		( width, expected ) => {
			expect( getWidthClass( width ) ).toEqual( expected );
		}
	);
} );
