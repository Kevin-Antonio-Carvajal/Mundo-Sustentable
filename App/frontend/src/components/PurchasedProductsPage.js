import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div className="purchased-products-list">
            <button onClick={() => navigate(-1)} className="button">Regresar</button>
            {productos.length > 0 ? (
                productos.map(producto => (
                    <div className="product-item" key={producto.id}>
                        <img src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-image.png"} alt={producto.nombre} className="product-image" />
                        <div className="product-details">
                            <div className="product-name">{producto.nombre}</div>
                            <div className="product-description">{producto.descripcion}</div>
                            <div>Categoria: {producto.categoria}</div>
                            <div>Contacto: {producto.contacto}</div>
                            <div>Precio: ${producto.precio}</div>
                            <button onClick={() => navigate(`/agregar-opinion/${producto.id}`)} className="button">Agregar Opinión</button>
                        </div>
                    </div>
                ))
            ) : (
                <div>No has comprado productos aún.</div>
            )}
        </div>
    );
};

export default PurchasedProductsPage;