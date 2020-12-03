/**
 * Gets the block name with the namespace.
 *
 * @param {Object} block The full block.
 * @return {string} The block name, like 'genesis-custom-blocks/foo-name'.
 */
const getBlockNameWithNameSpace = ( block ) => {
	return Object.keys( block ).length
		? Object.keys( block )[ 0 ]
		: '';
};

export default getBlockNameWithNameSpace;
