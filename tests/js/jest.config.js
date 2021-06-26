module.exports = {
	rootDir: '../../',
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	transform: {
		'^.+\\.[jt]sx?$': 'ts-jest',
	},
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
