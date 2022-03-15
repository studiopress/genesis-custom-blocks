/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { convertSettingsStringToArray, convertSettingsArrayToString } from '../../helpers';

/**
 * @typedef {Object} TextareaArrayProps The component props.
 * @property {Function}                    handleOnChange Handles a change in this setting.
 * @property {import('../editor').Setting} setting        This setting.
 * @property {Array|undefined}             value          The setting value.
 */

/**
 * The textarea array component.
 *
 * @param {TextareaArrayProps} props The component props.
 * @return {React.ReactElement} The textarea array component.
 */
const TextareaArray = ( { handleOnChange, setting, value } ) => {
	const id = `setting-textarea-array-${ setting.name }`;
	const stringValue = convertSettingsArrayToString( value );
	const textAreaValue = undefined === stringValue ? setting.default : stringValue;
	const helpClass = 'block italic text-xs mt-1';

	return (
		<>
			<label className="text-sm" htmlFor={ id }>{ setting.label }</label>
			<textarea
				id={ id }
				className="flex items-center w-full rounded-sm border border-gray-600 mt-2 px-2 text-sm"
				rows={ 6 }
				onChange={ ( event ) => {
					if ( event.target ) {
						handleOnChange( convertSettingsStringToArray( event.target.value ) );
					}
				} }
				value={ textAreaValue }
			/>
			{ Boolean( setting.help )
				? (
					<p className={ helpClass }>
						{ setting.help }
					</p>
				) : (
					<>
						<p className={ helpClass }>
							{ __(
								'Each choice on a new line. To specify the value and label separately, use this format:',
								'genesis-custom-blocks'
							) }
						</p>
						<p className={ helpClass }>
							foo : Foo
						</p>
						<p className={ helpClass }>
							bar : Bar
						</p>
					</>
				)
			}
		</>
	);
};

export default TextareaArray;
