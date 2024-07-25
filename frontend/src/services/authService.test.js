// src/services/authService.test.js
// Importiert die supabase Instanz aus der supabaseClient Datei
import { supabase } from '../supabaseClient';

// Importiert die signIn und signUp Funktionen aus dem authService
import { signIn, signUp } from './authService';

// Verwendet Jest, um den supabaseClient zu mocken, damit keine echten API-Aufrufe gemacht werden
jest.mock('../supabaseClient');

describe('authService', () => {
    // Führt eine Bereinigung der Mock-Daten durch, bevor jeder Test ausgeführt wird
    beforeEach(() => {
        jest.clearAllMocks(); // Löscht alle Mocks, um eine saubere Testumgebung zu gewährleisten
    });

    test('signIn calls supabase.auth.signInWithPassword', async () => {
        // Simuliert die Rückgabe eines erfolgreichen Anmeldeversuchs
        const mockResponse = { data: { id: 1 }, error: null };
        supabase.auth.signInWithPassword.mockResolvedValue(mockResponse);

        // Führt die signIn Funktion aus
        const result = await signIn('test@example.com', 'password');

        // Überprüft, ob die mock-Funktion mit den richtigen Argumenten aufgerufen wurde
        console.log('signInWithPassword Mock:', supabase.auth.signInWithPassword.mock.calls); // Protokolliert die Aufrufe für Debugging-Zwecke
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password',
        });

        // Überprüft, ob das Ergebnis dem mock-Datenobjekt entspricht
        expect(result).toEqual(mockResponse.data);
    });

    test('signUp calls supabase.auth.signUp', async () => {
        // Simuliert die Rückgabe eines erfolgreichen Registrierungsversuchs
        const mockResponse = { user: { id: 1 }, error: null };
        supabase.auth.signUp.mockResolvedValue(mockResponse);

        // Führt die signUp Funktion aus
        const result = await signUp('test120@example120.com', 'password123');

        // Überprüft, ob die mock-Funktion mit den richtigen Argumenten aufgerufen wurde
        console.log('signUp Mock:', supabase.auth.signUp.mock.calls); // Protokolliert die Aufrufe für Debugging-Zwecke
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: 'test120@example120.com',
            password: 'password123',
        });

        // Überprüft, ob das Ergebnis dem mock-Datenobjekt entspricht
        expect(result).toEqual(mockResponse.user);
    });
});