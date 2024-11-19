/**
 * Componente principal para la página de inicio.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    // para redirigir entre rutas.
    const navigate = useNavigate();

    /**
     * Maneja el cierre de sesión.
     * Redirige al usuario a la página principal.
     */
    const handleLogout = () => {
        navigate('/');
    };

    /**
     * Navega a la página de consulta de productos.
     */
    const handleConsultarProductos = () => {
        navigate('/productos');
    };

    /**
     * Navega a la página de productos comprados.
     */
    const handleProductosComprados = () => {
        navigate('/productos-comprados');
    };

    // Renderiza la interfaz de usuario para la página de inicio.
    return (
        <div className="home-page-container">
            <h1>Bienvenido, explora nuestros productos!</h1>
            <button onClick={handleConsultarProductos} className="home-page-button">Consultar productos</button>
            <button onClick={handleProductosComprados} className="home-page-button">Productos comprados</button>
            <button onClick={handleLogout} className="home-page-button">Cerrar sesión</button>
        </div>
    );
};

export default HomePage;
