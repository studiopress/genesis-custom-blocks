// @ts-check

/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * @typedef {Object} WidthProps The component props.
 * @property {Object} setting This setting.
 * @property {string|undefined} value The setting value.
 * @property {Function} handleOnChange Handles a change in this setting.
 */

/**
 * The field settings.
 *
 * @param {WidthProps} props The component props.
 * @return {React.ReactElement} The component for the admin page.
 */
const Width = ( { handleOnChange, setting, value } ) => {
	const name = `setting-${ setting.name }`;
	return (
		<>
			<span className="text-sm">{ setting.label }</span>
			<div className="gcb-setting-width flex w-full border border-gray-600 rounded-sm mt-2">
				{ [ '25', '50', '75', '100' ].map( ( width, index ) => {
					const key = `${ name }-${ index }`;
					const isSelected = width === value;

					return (
						<button
							key={ key }
							className={
								classNames(
									'w-0 flex-grow h-8 rounded-sm text-sm',
									{ active: isSelected }
								)
							}
							onClick={ () => {
								handleOnChange( width );
							} }
						>
							{ `${ width }%` }
						</button>
					);
				} ) }
			</div>
		</>
	);
};

export default Width;