// @ts-check

/**
 * Internal dependencies
 */
import controls from '../controls';

/**
 * This adds this plugin's controls.
 *
 * @param {Object} initialControls The initial controls to filter.
 * @return {Object} The filtered controls.
 */
const addControls = ( initialControls ) => {
	return {
		...initialControls,
		...controls,
	};
};

export default addControls;
