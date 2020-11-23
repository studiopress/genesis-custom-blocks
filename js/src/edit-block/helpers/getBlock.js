/**
 * Gets the full block from the post content.
 *
 * @param {string} postContent The post content as a JSON blob.
 * @return {Object} A block config object, or {}.
 */
const getBlock = ( postContent ) => {
	try {
		return JSON.parse( postContent );
	} catch ( error ) {
		return {};
	}
};

export default getBlock;
