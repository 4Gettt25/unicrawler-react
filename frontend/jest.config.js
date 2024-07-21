module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
	testMatch: ['**/test/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
	moduleDirectories: ['node_modules', 'src'],
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Ensure Babel is used for transformation
	},
};
