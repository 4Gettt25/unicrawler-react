// cypress/e2e/auth.cy.js
describe('Authentication', () => {
	beforeEach(() => {
		// Ensure the baseUrl is correct
		cy.visit('/login');
	});

	it('allows a user to sign up', () => {
		cy.visit('/signup');
		cy.get('input[name="name"]').type('Test User');
		cy.get('input[name="email"]').type('test@example.com');
		cy.get('input[name="password"]').type('password123');
		cy.get('button').contains('Create Account').click();
		cy.url().should('include', '/login');
	});

	it('allows a user to sign in', () => {
		cy.visit('/login'); // Explicitly visit login page to ensure correct page
		cy.get('input[name="email"]').type('test@example.com');
		cy.get('input[name="password"]').type('password123');
		cy.get('button').contains('Sign In').click();
		cy.url().should('include', '/chat');
	});
});
