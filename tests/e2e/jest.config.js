module.exports = {
	...require( '@wordpress/scripts/config/jest-e2e.config' ),
	setupFilesAfterEnv: [
		'<rootDir>/config/setup-test-framework.js',
		'@wordpress/jest-console',
		'expect-puppeteer',
	],
	transform: {
		'\\.[jt]sx?$': '<rootDir>/../../node_modules/@wordpress/scripts/config/babel-transform',
	},
};
