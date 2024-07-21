// src/App.test.js
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders sidebar and main content', () => {
	render(
		<MemoryRouter>
			<App />
		</MemoryRouter>
	);

	const sidebar = screen.getByText(/Menu/i);
	expect(sidebar).toBeInTheDocument();

	const mainContent = screen.getByRole('heading', { level: 2 });
	expect(mainContent).toHaveTextContent(/Sign in to Unicrawler/i);
});

test('navigates to signup page', () => {
	render(
		<MemoryRouter initialEntries={['/login']}>
			<App />
		</MemoryRouter>
	);

	const signUpLink = screen.getByText(/Don't have an account\? Sign up/i);
	fireEvent.click(signUpLink);

	const signUpHeading = screen.getByRole('heading', { level: 2 });
	expect(signUpHeading).toHaveTextContent(/Sign up to Unicrawler/i);
});
