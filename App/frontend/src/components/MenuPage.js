import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

const MenuPage = () => {
    const navigate = useNavigate();
  
    const goToProductForm = () => {
      navigate('/product-form');
    };
    
    const goToWelcome = () => {
      navigate('/');
    };

    const goToMyProducts = () => {
      navigate('/mis-productos');
    };

    return (
      <div className="menu-page-container">
        <h2>Bienvenido, es hora de vender!</h2>
        <h4>Selecciona los botones para administrar tus productos</h4>
        <button onClick={goToProductForm} className="menu-page-button">Alta de Producto</button>
        <button onClick={goToMyProducts} className="menu-page-button">Mis Productos</button>
        <button onClick={goToWelcome} className="menu-page-button">Cerrar Sesión</button>
      </div>
    );
};

export default MenuPage;
