/**
 * Componente de la página del menú para los vendedores.
 * Proporciona opciones para que el vendedor administre sus productos
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

const MenuPage = () => {
    const navigate = useNavigate();

    /**
     * Navega a la página para registrar un nuevo producto.
     */
    const goToProductForm = () => {
        navigate('/product-form');
    };

    /**
     * Navega a la página de inicio.
     * Utilizado para cerrar sesión.
     */
    const goToWelcome = () => {
        navigate('/');
    };

    /**
     * Navega a la página de "Mis Productos".
     * Permite a los vendedores administrar los productos que ya han registrado.
     */
    const goToMyProducts = () => {
        navigate('/mis-productos');
    };

    /**
     * Renderiza la interfaz de usuario para el menú principal de los vendedores.
     */
    return (
        <div className="menu-page-container">
            <h2>Bienvenido, es hora de vender!</h2>
            <h4>Selecciona los botones para administrar tus productos</h4>
            {/* Botón para dar de alta un nuevo producto */}
            <button onClick={goToProductForm} className="menu-page-button">
                Alta de Producto
            </button>
            {/* Botón para acceder a la página "Mis Productos" */}
            <button onClick={goToMyProducts} className="menu-page-button">
                Mis Productos
            </button>
            {/* Botón para cerrar sesión y regresar al inicio */}
            <button onClick={goToWelcome} className="menu-page-button">
                Cerrar Sesión
            </button>
        </div>
    );
};

export default MenuPage;
