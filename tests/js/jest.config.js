module.exports = {
	rootDir: '../../',
	...require( '@wordpress/scripts/config/jest-unit.config' ),
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
		'^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
	},
	coverageReporters: [ 'lcov' ],
	coverageDirectory: '<rootDir>/coverage',
};
