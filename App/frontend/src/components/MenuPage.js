import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

const MenuPage = () => {
    const navigate = useNavigate();
  
    const goToProductForm = () => {
      navigate('/product-form'); // Navega al formulario de alta de producto
    };
    
    const goToWelcome = () => {
      navigate('/'); // Navega al formulario de alta de producto
    };

    const goToMyProducts = () => {
      navigate('/mis-productos');
    };

    return (
      <div className="Menu">
        <h2>Bienvenido, es hora de vender!</h2>
        <h4>Selecciona los botones para administrar tus productos</h4>
        <button  onClick={goToProductForm} className="button">Alta de Producto</button>
        <button onClick={goToMyProducts} className="button">Mis Productos</button>
        <button  onClick={goToWelcome} className="button">Cerrar Sesión</button>

      </div>
    );
  };
  
  export default MenuPage;