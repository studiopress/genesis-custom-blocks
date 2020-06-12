module.exports = {
	rootDir: '../../',
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	transform: {
		'^.+\\.[jt]sx?$': '<rootDir>/node_modules/@wordpress/scripts/config/babel-transform',
	},
	testEnvironment: 'jest-environment-jsdom-sixteen',
	testPathIgnorePatterns: [
		'<rootDir>/.git',
		'<rootDir>/node_modules',
	],
	coveragePathIgnorePatterns: [
		'<rootDir>/node_modules',
	],
	coverageReporters: [ 'lcov' ],
	coverageDirectory: '<rootDir>/coverage',
	reporters: [ [ 'jest-silent-reporter', { useDots: true } ] ],
	setupFilesAfterEnv: [ '<rootDir>/tests/js/jest.setup.js' ],
};
