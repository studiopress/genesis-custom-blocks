/**
 * Ensures that the provided function isn't called multiple times in succession.
 *
 * Forked from BMO's work in Genesis Blocks.
 *
 * @param {() => any} func
 * @param {number}    wait
 *
 * @return {() => void} A debounced function.
 */
const debounce = ( func, wait ) => {
	let timeout;
	return function executedFunction( ...args ) {
		const later = () => {
			clearTimeout( timeout );
			func( ...args );
		};

		clearTimeout( timeout );
		timeout = setTimeout( later, wait );
	};
};

export default debounce;
