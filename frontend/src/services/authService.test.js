// src/services/authService.test.js
import { supabase } from '../supabaseClient';
import { signIn, signUp } from './authService';

jest.mock('../supabaseClient'); // This tells Jest to use the mock

describe('authService', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('signIn calls supabase.auth.signInWithPassword', async () => {
        const mockResponse = { data: { id: 1 }, error: null };
        supabase.auth.signInWithPassword.mockResolvedValue(mockResponse);

        const result = await signIn('test@example.com', 'password');

        console.log('signInWithPassword Mock:', supabase.auth.signInWithPassword.mock.calls); // Add log to verify mock
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password',
        });
        expect(result).toEqual(mockResponse.data);
    });

    test('signUp calls supabase.auth.signUp', async () => {
        const mockResponse = { user: { id: 1 }, error: null };
        supabase.auth.signUp.mockResolvedValue(mockResponse);

        const result = await signUp('test120@example120.com', 'password123');

        console.log('signUp Mock:', supabase.auth.signUp.mock.calls); // Add log to verify mock
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: 'test120@example120.com',
            password: 'password123',
        });
        expect(result).toEqual(mockResponse.user);
    });
});
