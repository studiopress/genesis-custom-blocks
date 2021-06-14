/**
 * Internal dependencies
 */
import GcbTextControl from './text';
import GcbTextareaControl from './textarea';
import GcbURLControl from './url';
import GcbEmailControl from './email';
import GcbFileControl from './file';
import GcbNumberControl from './number';
import GcbColorControl from './color';
import GcbImageControl from './image';
import GcbCheckboxControl from './checkbox';
import GcbRadioControl from './radio';
import GcbRangeControl from './range';
import GcbSelectControl from './select';
import GcbMultiselectControl from './multiselect';
import GcbToggleControl from './toggle';

export default {
	text: GcbTextControl,
	textarea: GcbTextareaControl,
	url: GcbURLControl,
	email: GcbEmailControl,
	file: GcbFileControl,
	number: GcbNumberControl,
	color: GcbColorControl,
	image: GcbImageControl,
	checkbox: GcbCheckboxControl,
	radio: GcbRadioControl,
	range: GcbRangeControl,
	select: GcbSelectControl,
	multiselect: GcbMultiselectControl,
	toggle: GcbToggleControl,
};
