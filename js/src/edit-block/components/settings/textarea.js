/**
 * External dependencies
 */
import * as React from 'react';

/**
 * @typedef {Object} TextareaProps The component props.
 * @property {Function} handleOnChange Handles a change in this setting.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 */

/**
 * The textarea component.
 *
 * @param {TextareaProps} props The component props.
 * @return {React.ReactElement} The textarea component.
 */
const Textarea = ( { handleOnChange, setting, value } ) => {
	const id = `setting-textarea-${ setting.name }`;
	const textAreaValue = undefined === value ? setting.default : value;

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<textarea
				id={ id }
				className="flex items-center w-full rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				rows={ 6 }
				onChange={ ( event ) => {
					if ( event.target ) {
						handleOnChange( event.target.value );
					}
				} }
				value={ textAreaValue }
			/>
		</>
	);
};

export default Textarea;
