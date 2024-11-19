/**
 * Este componente muestra los productos comprados por el usuario autenticado.
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PurchasedProductsPage.css';

const PurchasedProductsPage = () => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

    /**
     * useEffect se ejecuta al montar el componente.
     * Llama a la función para obtener los productos comprados desde la API.
     */
    useEffect(() => {
        const fetchProductosComprados = async () => {
            const token = localStorage.getItem('token'); // Obtiene el token de autenticación
            if (!token) {
                navigate('/login'); 
                return;
            }
            try {
                // Realiza una solicitud GET para obtener los productos comprados
                const { data } = await axios.get('http://localhost:5000/api/productos-comprados', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProductos(data); // Actualiza el estado con los productos obtenidos
            } catch (error) {
                console.error('Error cargando los productos comprados', error); 
            }
        };
        fetchProductosComprados(); 
    }, [navigate]);

    return (
        <div className="purchased-products-container">
            {/* Título de la página */}
            <h2 className="page-title">Productos Comprados</h2>
            {/* Botón para regresar a la página anterior */}
            <button onClick={() => navigate(-1)} className="back-button">Regresar</button>
            <div className="purchased-product-grid">
                {/* Verifica si hay productos comprados para mostrar */}
                {productos.length > 0 ? (
                    productos.map(producto => (
                        <div className="purchased-product-card" key={producto.id}>
                            <div className="purchased-product-image-container">
                                {/* Muestra la imagen del producto o un placeholder si no hay imagen */}
                                <img 
                                    src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-image.png"} 
                                    alt={producto.nombre} 
                                    className="purchased-product-image" 
                                />
                            </div>
                            <div className="purchased-product-details">
                                {/* Muestra los detalles del producto */}
                                <h3 className="product-name">Título: {producto.nombre}</h3>
                                <p className="product-description"><strong>Descripción:</strong> {producto.descripcion}</p>
                                <p className="product-category"><strong>Categoría:</strong> {producto.categoria}</p>
                                <p className="product-contact"><strong>Contacto:</strong> {producto.contacto}</p>
                                <p className="product-price"><strong>Precio:</strong> ${producto.precio}</p>
                                {/* Botón para agregar una opinión sobre el producto */}
                                <button onClick={() => navigate(`/agregar-opinion/${producto.id}`)} className="opinion-button">Agregar Opinión</button>
                            </div>
                        </div>
                    ))
                ) : (
                    // Muestra un mensaje si no hay productos comprados
                    <div className="no-products-message">No has comprado productos aún.</div>
                )}
            </div>
        </div>
    );
};

export default PurchasedProductsPage;
