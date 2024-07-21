// src/Login.test.js
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

test('renders login form', () => {
	render(
		<MemoryRouter>
			<Login />
		</MemoryRouter>
	);

	const emailInput = screen.getByLabelText(/Email/i);
	const passwordInput = screen.getByLabelText(/Password/i);
	const submitButton = screen.getByText(/Sign In/i);

	expect(emailInput).toBeInTheDocument();
	expect(passwordInput).toBeInTheDocument();
	expect(submitButton).toBeInTheDocument();
});

test('displays error message on invalid login', async () => {
	render(
		<MemoryRouter>
			<Login />
		</MemoryRouter>
	);

	fireEvent.change(screen.getByLabelText(/Email/i), {
		target: { value: 'invalid@user.com' },
	});
	fireEvent.change(screen.getByLabelText(/Password/i), {
		target: { value: 'wrongpassword' },
	});
	fireEvent.click(screen.getByText(/Sign In/i));

	const errorMessage = await screen.findByText(/Incorrect email or password/i);
	expect(errorMessage).toBeInTheDocument();
});
