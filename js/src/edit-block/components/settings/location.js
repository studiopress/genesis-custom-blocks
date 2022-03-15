/**
 * External dependencies
 */
import * as React from 'react';

/**
 * Internal dependencies
 */
import { Select } from '../';
import { LOCATIONS_WITH_LABEL, LOCATIONS } from '../../../common/constants';

/**
 * @typedef {Object} LocationProps The component props.
 * @property {import('../editor').Setting} setting            This setting.
 * @property {string|undefined}            value              The setting value.
 * @property {Function}                    handleOnChange     Handles a change to this setting.
 * @property {Function}                    setCurrentLocation Sets the selected location, like 'editor'.
 */

/**
 * The location component.
 *
 * @param {LocationProps} props The component props.
 * @return {React.ReactElement} The select component.
 */
const Location = ( props ) => {
	const { handleOnChange, setCurrentLocation } = props;
	const id = `setting-${ props.setting.name }`;

	return (
		<Select
			{ ...props }
			handleOnChange={ ( newValue ) => {
				handleOnChange( newValue );
				if ( LOCATIONS.includes( newValue ) ) {
					setCurrentLocation( newValue );
				}
			} }
			id={ id }
			options={ LOCATIONS_WITH_LABEL }
		/>
	);
};

export default Location;
