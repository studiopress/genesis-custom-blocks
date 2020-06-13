/**
 * Internal dependencies
 */
import GcbTextControl from './text';
import GcbTextareaControl from './textarea';
import GcbClassicTextControl from './classic-text';
import GcbRichTextControl from './rich-text';
import GcbURLControl from './url';
import GcbEmailControl from './email';
import GcbNumberControl from './number';
import GcbColorControl from './color';
import GcbImageControl from './image';
import GcbCheckboxControl from './checkbox';
import GcbRadioControl from './radio';
import GcbRangeControl from './range';
import GcbSelectControl from './select';
import GcbMultiselectControl from './multiselect';
import GcbPostControl from './post';
import GcbRepeaterControl from './repeater';
import GcbTaxonomyControl from './taxonomy';
import GcbToggleControl from './toggle';
import GcbUserControl from './user';

export default {
	text: GcbTextControl,
	textarea: GcbTextareaControl,
	classic_text: GcbClassicTextControl,
	rich_text: GcbRichTextControl,
	url: GcbURLControl,
	email: GcbEmailControl,
	number: GcbNumberControl,
	color: GcbColorControl,
	image: GcbImageControl,
	checkbox: GcbCheckboxControl,
	radio: GcbRadioControl,
	range: GcbRangeControl,
	repeater: GcbRepeaterControl,
	select: GcbSelectControl,
	multiselect: GcbMultiselectControl,
	post: GcbPostControl,
	taxonomy: GcbTaxonomyControl,
	toggle: GcbToggleControl,
	user: GcbUserControl,
};
