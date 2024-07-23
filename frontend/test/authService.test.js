// src/services/authService.test.js
import { signIn, signUp } from '../src/services/authService';
import { supabase } from '../src/supabaseClient';

jest.mock('../src/supabaseClient');

describe('authService', () => {
	it('signs up a new user', async () => {
		supabase.auth.signUp.mockResolvedValue({
			user: { id: '123' },
			error: null,
		});

		const user = await signUp('test@example.com', 'password123');
		expect(user).toEqual({ id: '123' });
	});

	it('signs in an existing user', async () => {
		supabase.auth.signInWithPassword.mockResolvedValue({
			data: { id: '123' },
			error: null,
		});

		const data = await signIn('test@example.com', 'password123');
		expect(data).toEqual({ id: '123' });
	});
});
