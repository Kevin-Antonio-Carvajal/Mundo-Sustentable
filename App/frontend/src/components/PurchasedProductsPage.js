import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PurchasedProductsPage.css';

const PurchasedProductsPage = () => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductosComprados = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const { data } = await axios.get('http://localhost:5000/api/productos-comprados', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProductos(data);
            } catch (error) {
                console.error('Error cargando los productos comprados', error);
            }
        };
        fetchProductosComprados();
    }, [navigate]);

    return (
        <div className="purchased-products-container">
            <h2 className="page-title">Productos Comprados</h2>
            <button onClick={() => navigate(-1)} className="back-button">Regresar</button>
            <div className="purchased-product-grid">
                {productos.length > 0 ? (
                    productos.map(producto => (
                        <div className="purchased-product-card" key={producto.id}>
                            <div className="purchased-product-image-container">
                                <img 
                                    src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-image.png"} 
                                    alt={producto.nombre} 
                                    className="purchased-product-image" 
                                />
                            </div>
                            <div className="purchased-product-details">
                                <h3 className="product-name">Título: {producto.nombre}</h3>
                                <p className="product-description"><strong>Descripción:</strong> {producto.descripcion}</p>
                                <p className="product-category"><strong>Categoría:</strong> {producto.categoria}</p>
                                <p className="product-contact"><strong>Contacto:</strong> {producto.contacto}</p>
                                <p className="product-price"><strong>Precio:</strong> ${producto.precio}</p>
                                <button onClick={() => navigate(`/agregar-opinion/${producto.id}`)} className="opinion-button">Agregar Opinión</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-products-message">No has comprado productos aún.</div>
                )}
            </div>
        </div>
    );
};

export default PurchasedProductsPage;
