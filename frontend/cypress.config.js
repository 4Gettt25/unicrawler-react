// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3000',
		supportFile: 'cypress/support/e2e.js',
		pageLoadTimeout: 120000, // Increase timeout to 120 seconds
	},
});
