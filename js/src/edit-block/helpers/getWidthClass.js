/**
 * Gets a class, based on the width of a field.
 *
 * @param {string|number} width The width, like '100' or 100.
 * @return {string} The class for the width.
 */
const getWidthClass = ( width ) => {
	const parsedWidth = 'number' === typeof width ? parseInt( width ) : width;
	const defaultWidth = '4';
	const widthOrDefault = parsedWidth
		? Math.floor( parsedWidth / 25 ).toString()
		: defaultWidth;

	return `col-span-${ widthOrDefault }`;
};

export default getWidthClass;
