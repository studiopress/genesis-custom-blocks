module.exports = {
	rootDir: '../../',
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	globals: {
		window: {
			ResizeObserver: () => {},
		}
	},
	transform: {
		'^.+\\.[jt]sx?$': '<rootDir>/node_modules/@wordpress/scripts/config/babel-transform',
	},
	testPathIgnorePatterns: [
		'<rootDir>/.git',
		'<rootDir>/node_modules',
	],
	coveragePathIgnorePatterns: [
		'<rootDir>/node_modules',
	],
	moduleNameMapper: {
		'^react($|/.+)': '<rootDir>/node_modules/react$1',
	},
	coverageReporters: [ 'lcov' ],
	coverageDirectory: '<rootDir>/coverage',
	reporters: [ [ 'jest-silent-reporter', { useDots: true } ] ],
	setupFilesAfterEnv: [ '<rootDir>/tests/js/jest.setup.js' ],
};
