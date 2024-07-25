const dotenv = require('dotenv');
const { set } = require('react-hook-form');

module.exports = {
	testEnvironment: 'jsdom',
	testMatch: ['**/test/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
	moduleDirectories: ['node_modules', 'src'],
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Ensure Babel is used for transformation
		'^.+\\.css$': 'jest-transform-stub',
	},
	moduleNameMapper: {
		'\\.css$': 'identity-obj-proxy', // Use identity-obj-proxy for CSS modules
		'^../src/supabaseClient$': '<rootDir>/src/__mocks__/supabaseClient.js',
	},
	"setupFiles": ["<rootDir>/jest.setup.js"]
};
