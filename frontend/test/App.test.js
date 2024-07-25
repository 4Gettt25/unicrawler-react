import '@testing-library/jest-dom'; // Import jest-dom for toBeInTheDocument matcher
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('App Component', () => {
    test('renders login page', () => {
        renderWithRouter(<App />, { route: '/login' });
        expect(screen.getByText(/sign in to unicrawler/i)).toBeInTheDocument();
    });

    test('renders signup page', () => {
        renderWithRouter(<App />, { route: '/signup' });
        expect(screen.getByText(/sign up to unicrawler/i)).toBeInTheDocument();
    });

    test('renders main content when not on auth page', () => {
        renderWithRouter(<App />, { route: '/chat' });
        expect(screen.getByText(/menu/i)).toBeInTheDocument();
        expect(screen.getByText(/new chat/i)).toBeInTheDocument();
    });

    test('toggles user actions', () => {
        renderWithRouter(<App />, { route: '/chat' });
        const userPanel = screen.getByText(/active users: 1/i).closest('.user-panel');
        fireEvent.click(userPanel);
        expect(screen.getByText(/settings/i)).toBeInTheDocument();
        expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    });
});
