// src/Signup.test.js
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';

test('renders signup form', () => {
	render(
		<MemoryRouter>
			<Signup />
		</MemoryRouter>
	);

	const nameInput = screen.getByLabelText(/Name/i);
	const emailInput = screen.getByLabelText(/Email/i);
	const passwordInput = screen.getByLabelText(/Password/i);
	const submitButton = screen.getByText(/Create Account/i);

	expect(nameInput).toBeInTheDocument();
	expect(emailInput).toBeInTheDocument();
	expect(passwordInput).toBeInTheDocument();
	expect(submitButton).toBeInTheDocument();
});

test('displays error message on invalid email format', async () => {
	render(
		<MemoryRouter>
			<Signup />
		</MemoryRouter>
	);

	fireEvent.change(screen.getByLabelText(/Email/i), {
		target: { value: 'invalidemail' },
	});
	fireEvent.change(screen.getByLabelText(/Password/i), {
		target: { value: 'password123' },
	});
	fireEvent.click(screen.getByText(/Create Account/i));

	const errorMessage = await screen.findByText(/Invalid email format/i);
	expect(errorMessage).toBeInTheDocument();
});
