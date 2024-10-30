import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/'); // Navegación al inicio
    };
    const handleConsultarProductos = () => {
        navigate('/productos'); // Navega a la ruta de productos
    };
    const handleProductosComprados = () => {
        navigate('/productos-comprados'); // Navega a la página de productos comprados
    };

    return (
        <div className="home-container">
            <h1>Bienvenido, explora nuestros productos!</h1>
            <button onClick={handleConsultarProductos} className="button">Consultar Producto</button>
            <button onClick={handleProductosComprados} className="button">Productos Comprados</button>
            <button onClick={handleLogout} className='button'>Log Out</button>
        </div>
    );
};

export default HomePage;