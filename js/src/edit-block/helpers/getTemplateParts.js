/**
 * Gets 2 template parts: the base path and the file name.
 * 
 * For example, on passing 'wp-content/themes/yourtheme/blocks/block-test.php',
 * this will return [ 'wp-content/themes/yourtheme/blocks/', 'block-test.php' ].
 *
 * @param {string} templateFile The path to the template.
 * @return {string[]} Template parts: the base path, and the file name.
 */
const getTemplateParts = ( templateFile ) => {
	const matches = templateFile.match( /(.*\/)([A-Za-z0-9_-]+\.php$)/ );

	return matches 
		? [ matches[1], matches[2] ]
		: [ '', templateFile ];
};

export default getTemplateParts;
