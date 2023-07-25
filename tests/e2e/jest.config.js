module.exports = {
	...require( '@wordpress/scripts/config/jest-e2e.config' ),
	transform: {
		'^.+\\.[jt]sx?$': '<rootDir>/node_modules/@wordpress/scripts/config/babel-transform',
	},
	setupFilesAfterEnv: [
		'<rootDir>/config/setup-test-framework.js',
		'@wordpress/jest-console',
		'expect-puppeteer',
	],
	testPathIgnorePatterns: [
		'/node_modules/',
	],
};
