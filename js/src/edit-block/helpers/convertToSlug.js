/**
 * Converts a string to a slug.
 *
 * @param {string} toConvert The string to convert to a slug like 'Example Here'.
 * @return {string} The string as a slug, like 'example-here'.
 */
const convertToSlug = ( toConvert ) => {
	return toConvert
		.toLowerCase()
		.replace( /[^\w ]+/g, '' )
		.replace( / +/g, '-' )
		.replace( /_+/g, '-' );
};

export default convertToSlug;
