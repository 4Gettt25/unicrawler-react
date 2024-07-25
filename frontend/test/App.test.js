import '@testing-library/jest-dom'; // Importiert jest-dom für zusätzliche Matcher wie toBeInTheDocument
import { fireEvent, render, screen } from '@testing-library/react'; // Importiert notwendige Funktionen für Tests
import React from 'react'; // Importiert React
import { BrowserRouter } from 'react-router-dom'; // Importiert BrowserRouter für Routing in React
import App from '../src/App'; // Importiert die Hauptanwendungskomponente

// Definiert eine Hilfsfunktion, um Komponenten mit Router-Kontext zu rendern
const renderWithRouter = (ui, { route = '/' } = {}) => {
    // Setzt den Browserpfad für die aktuelle Testseite
    window.history.pushState({}, 'Test page', route);
    // Rendert die übergebene UI-Komponente mit einem Router-Wrapper
    return render(ui, { wrapper: BrowserRouter });
};

describe('App Component', () => {
    // Testet, ob die Login-Seite korrekt gerendert wird
    test('renders login page', () => {
        renderWithRouter(<App />, { route: '/login' }); // Rendert die App-Komponente mit dem Pfad '/login'
        // Überprüft, ob der Text "sign in to unicrawler" im Dokument vorhanden ist
        expect(screen.getByText(/sign in to unicrawler/i)).toBeInTheDocument();
    });

    // Testet, ob die Registrierungsseite korrekt gerendert wird
    test('renders signup page', () => {
        renderWithRouter(<App />, { route: '/signup' }); // Rendert die App-Komponente mit dem Pfad '/signup'
        // Überprüft, ob der Text "sign up to unicrawler" im Dokument vorhanden ist
        expect(screen.getByText(/sign up to unicrawler/i)).toBeInTheDocument();
    });

    // Testet, ob der Hauptinhalt angezeigt wird, wenn die Route nicht zu einer Authentifizierungsseite führt
    test('renders main content when not on auth page', () => {
        renderWithRouter(<App />, { route: '/chat' }); // Rendert die App-Komponente mit dem Pfad '/chat'
        // Überprüft, ob die Menüpunkte "menu" und "new chat" im Dokument vorhanden sind
        expect(screen.getByText(/menu/i)).toBeInTheDocument();
        expect(screen.getByText(/new chat/i)).toBeInTheDocument();
    });

    // Testet die Funktionalität zum Umschalten von Benutzeraktionen
    test('toggles user actions', () => {
        renderWithRouter(<App />, { route: '/chat' }); // Rendert die App-Komponente mit dem Pfad '/chat'
        // Sucht das Benutzerpanel und löst ein Klickereignis aus
        const userPanel = screen.getByText(/active users: 1/i).closest('.user-panel');
        fireEvent.click(userPanel);
        // Überprüft, ob die Elemente "settings" und "sign out" nach dem Klick im Dokument vorhanden sind
        expect(screen.getByText(/settings/i)).toBeInTheDocument();
        expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    });
});