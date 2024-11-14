import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const { productId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducto = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const { data } = await axios.get(`http://localhost:5000/api/productos/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducto(data);
            } catch (error) {
                console.error('Error cargando el producto', error);
            } finally {
                setCargando(false);
            }
        };
        fetchProducto();
    }, [productId, navigate]);

    if (cargando) {
        return <div>Cargando...</div>;
    }

    if (!producto) {
        return <div>Producto no encontrado</div>;
    }

    return (
        <div className="product-details-container">
            <h1>Detalles del Producto</h1>
            <img src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-imagen.png"} alt={producto.nombre} className="product-details-image" />
            <div className="product-details-info">
                <h2>{producto.titulo}</h2>
                <p>{producto.descripcion}</p>
                <p>Categoría: {producto.categoria}</p>
                <p>Contacto: {producto.contacto}</p>
                <p>Precio: ${producto.precio}</p>
            </div>
            <button onClick={() => navigate(-1)} className="product-details-button">Regresar</button>
        </div>
    );
};

export default ProductDetailsPage;
