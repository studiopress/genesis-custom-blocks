// @ts-check

/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { Input } from '../';

/**
 * @typedef {Object} TextareaProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change in this setting.
 */

/**
 * The field settings.
 *
 * @param {TextareaProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Textarea = ( { handleOnChange, setting, value} ) => {
	const id = `setting-input-${ setting.name }`;

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<textarea
				id={ id }
				rows={ 6 }
				onChange={ ( event ) => {
					if ( event.target ) {
						handleOnChange( event.target.value );
					}
				} }
			>
				{ value }
			</textarea>	
		</>
	);
};

export default Textarea;
