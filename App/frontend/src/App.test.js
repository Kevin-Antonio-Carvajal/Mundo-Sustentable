// Importa las funciones necesarias para realizar pruebas y el componente App.
import { render, screen } from '@testing-library/react';
import App from './App';

// Define un caso de prueba para verificar que se renderiza un enlace con el texto "learn react".
test('renders learn react link', () => {
  // Renderiza el componente App en un entorno de prueba.
  render(<App />);
  
  // Busca un elemento que contenga el texto "learn react" (ignorando mayúsculas/minúsculas).
  const linkElement = screen.getByText(/learn react/i);
  
  // Verifica que el elemento está presente en el documento.
  expect(linkElement).toBeInTheDocument();
});
