/**
 * Este componente muestra los detalles de un producto específico.
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
    // Estados para almacenar los datos del producto y el estado de carga
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const { productId } = useParams();
    const navigate = useNavigate();

    /**
     * Hook useEffect para obtener los detalles del producto.
     * Realiza una solicitud a la API al cargar el componente.
     */
    useEffect(() => {
        const fetchProducto = async () => {
            const token = localStorage.getItem('token'); // Obtiene el token de autenticación
            if (!token) {
                navigate('/login'); // Redirige al login si no hay token
                return;
            }
            try {
                // Solicita los detalles del producto a la API
                const { data } = await axios.get(`http://localhost:5000/api/productos/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducto(data); // Almacena los datos del producto en el estado
            } catch (error) {
                console.error('Error cargando el producto', error); // Manejo de errores
            } finally {
                setCargando(false); // Cambia el estado de carga
            }
        };
        fetchProducto();
    }, [productId, navigate]); 

    // Muestra un mensaje mientras se cargan los datos
    if (cargando) {
        return <div>Cargando...</div>;
    }

    // Muestra un mensaje si no se encuentra el producto
    if (!producto) {
        return <div>Producto no encontrado</div>;
    }

    /**
     * Renderiza los detalles del producto y un botón para regresar a la página anterior.
     */
    return (
        <div className="product-details-container">
            <h1>Detalles del Producto</h1>
            {/* Muestra la imagen del producto o una imagen por defecto */}
            <img 
                src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-imagen.png"} 
                alt={producto.nombre} 
                className="product-details-image" 
            />
            <div className="product-details-info">
                {/* Información del producto */}
                <h2>{producto.titulo}</h2>
                <p>{producto.descripcion}</p>
                <p>Categoría: {producto.categoria}</p>
                <p>Contacto: {producto.contacto}</p>
                <p>Precio: ${producto.precio}</p>
            </div>
            {/* Botón para regresar a la página anterior */}
            <button onClick={() => navigate(-1)} className="product-details-button">Regresar</button>
        </div>
    );
};

export default ProductDetailsPage;
