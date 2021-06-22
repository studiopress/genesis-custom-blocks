/**
 * Internal dependencies
 */
import { getFieldsAsArray } from '../../common/helpers';

/**
 * Gets whether this block has at least one repeater field.
 *
 * @param {Object} fields A key-value pair, the key being the field name, the value the Field object.
 * @return {boolean} Whether at least one repeater field is present.
 */
const hasRepeaterField = ( fields ) => {
	return getFieldsAsArray( fields ).some(
		/** @param {import('../components/editor').Field} field The field to check */
		( field ) => 'repeater' === field.control
	);
};

export default hasRepeaterField;
