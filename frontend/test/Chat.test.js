// src/Chat.test.js
import { fireEvent, render, screen } from '@testing-library/react';
import Chat from './Chat';

test('renders chat input and send button', () => {
	render(<Chat />);

	const input = screen.getByPlaceholderText(/Type a message/i);
	const sendButton = screen.getByText(/Send/i);

	expect(input).toBeInTheDocument();
	expect(sendButton).toBeInTheDocument();
});

test('sends a message', () => {
	render(<Chat />);

	const input = screen.getByPlaceholderText(/Type a message/i);
	const sendButton = screen.getByText(/Send/i);

	fireEvent.change(input, { target: { value: 'Hello, world!' } });
	fireEvent.click(sendButton);

	const message = screen.getByText(/Hello, world!/i);
	expect(message).toBeInTheDocument();
});
