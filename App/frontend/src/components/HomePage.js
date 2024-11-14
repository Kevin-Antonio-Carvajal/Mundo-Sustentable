import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };
    const handleConsultarProductos = () => {
        navigate('/productos');
    };
    const handleProductosComprados = () => {
        navigate('/productos-comprados');
    };

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
