/**
 * Internal dependencies
 */
import addControls from '../addControls';

test( 'addControls', () => {
	const mockControl = jest.fn();
	const initialControls = {
		apple: mockControl,
		banana: mockControl,
	};

	expect( addControls( initialControls ) ).toEqual(
		{
			apple: mockControl,
			banana: mockControl,
			checkbox: expect.anything(),
			color: expect.anything(),
			email: expect.anything(),
			file: expect.anything(),
			image: expect.anything(),
			inner_blocks: expect.anything(),
			multiselect: expect.anything(),
			number: expect.anything(),
			radio: expect.anything(),
			range: expect.anything(),
			select: expect.anything(),
			text: expect.anything(),
			textarea: expect.anything(),
			toggle: expect.anything(),
			url: expect.anything(),
		}
	);
} );
