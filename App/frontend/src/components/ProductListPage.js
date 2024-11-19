/**
 * Este componente muestra una lista de productos disponibles. 
 */

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './ProductListPage.css';
import { useNavigate } from 'react-router-dom';

const ProductListPage = () => {
    const [productos, setProductos] = useState([]);
    const [searchCategory, setSearchCategory] = useState('');
    const navigate = useNavigate();

    /**
     * Función para obtener productos desde la API.
     * Incluye un filtro opcional por categoría.
     */
    const fetchProductos = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirige al login si no hay token
            return;
        }

        const params = searchCategory ? { categoria: searchCategory } : {}; // Aplica el filtro de categoría si existe
        try {
            const { data } = await axios.get('http://localhost:5000/api/productos', {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setProductos(data); // Actualiza el estado con los productos obtenidos
        } catch (error) {
            console.error("Error cargando los productos", error);
        }
    }, [navigate, searchCategory]);

    /**
     * Llama a fetchProductos cada vez que cambia searchCategory.
     */
    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    /**
     * Maneja el cambio en el selector de categorías.
     * @param {Event} e - Evento del cambio en el selector.
     */
    const handleCategoryChange = (e) => {
        setSearchCategory(e.target.value);
    };

    /**
     * Ejecuta la búsqueda de productos basada en la categoría seleccionada.
     */
    const handleSearchClick = () => {
        fetchProductos();
    };

    /**
     * Realiza la compra de un producto.
     * @param {number} productoId - ID del producto a comprar.
     */
    const handleBuy = async (productoId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); 
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/comprar', 
            { producto_id: productoId }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Compra exitosa y correo enviado');
        } catch (error) {
            alert('Error al realizar la compra'); // Muestra un mensaje si ocurre un error
        }
    };

/**
 * Renderiza la lista de productos y las opciones de búsqueda.
 */
return (
    <div className="product-list-page">
        <div className="search-bar">
            {/* Selector de categorías */}
            <select value={searchCategory} onChange={handleCategoryChange} className="search-select">
                <option value="">Seleccione una categoría</option>
                <option value="alimentos">Alimentos Orgánicos</option>
                <option value="frutas_y_verduras">Frutas y Verduras</option>
                <option value="productos_de_limpieza">Productos de Limpieza</option>
                <option value="desechables">Utensilios Desechables</option>
            </select>
            {/* Botón de búsqueda */}
            <button onClick={handleSearchClick} className="search-button">Buscar</button>
        </div>
        {/* Botón para regresar a la página anterior */}
        <button onClick={() => navigate(-1)} className="back-button">Regresar</button>
        {/* Contenedor de productos */}
        <div className="product-grid">
            {productos.length > 0 ? (
                productos.map(producto => (
                    <div className="product-card" key={producto.id}>
                        <div className="product-image-container">
                            {/* Imagen del producto */}
                            <img 
                                src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-image.png"} 
                                alt={producto.nombre} 
                                className="product-image" 
                            />
                        </div>
                        {/* Información del producto */}
                        <div className="product-info">
                            <h3 className="product-title">Título: {producto.titulo}</h3>
                            <p className="product-description"><strong>Descripción:</strong> {producto.descripcion}</p>
                            <p className="product-category"><strong>Categoría:</strong> {producto.categoria}</p>
                            <p className="product-contact"><strong>Contacto:</strong> {producto.contacto}</p>
                            <p className="product-price"><strong>Precio:</strong> ${producto.precio}</p>
                            <div className="button-group">
                                {/* Botón para comprar el producto */}
                                <button onClick={() => handleBuy(producto.id)} className="buy-button">Comprar</button>
                                {/* Botón para ver opiniones */}
                                <button onClick={() => navigate(`/producto/${producto.id}/opiniones`)} className="view-opinions-button">Ver Opiniones</button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>No hay productos disponibles.</div>
            )}
        </div>
    </div>
);
};

export default ProductListPage;
