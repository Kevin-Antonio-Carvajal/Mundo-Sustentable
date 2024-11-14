import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './ProductListPage.css';
import { useNavigate } from 'react-router-dom';

const ProductListPage = () => {
    const [productos, setProductos] = useState([]);
    const [searchCategory, setSearchCategory] = useState('');
    const navigate = useNavigate();

    const fetchProductos = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const params = searchCategory ? { categoria: searchCategory } : {};
        try {
            const { data } = await axios.get('http://localhost:5000/api/productos', {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setProductos(data);
        } catch (error) {
            console.error("Error cargando los productos", error);
        }
    }, [navigate, searchCategory]);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    const handleCategoryChange = (e) => {
        setSearchCategory(e.target.value);
    };

    const handleSearchClick = () => {
        fetchProductos();
    };

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
            alert('Error al realizar la compra');
        }
    };

    return (
        <div className="product-list-page">
            <div className="search-bar">
                <select value={searchCategory} onChange={handleCategoryChange} className="search-select">
                    <option value="">Seleccione una categoría</option>
                    <option value="electronica">Electrónica</option>
                    <option value="alimentos">Alimentos</option>
                    <option value="ropa">Ropa</option>
                    <option value="calzado">Calzado</option>
                    <option value="joyeria">Joyería</option>
                    <option value="hogar">Artículos para el Hogar</option>
                    <option value="jardin">Jardinería</option>
                    <option value="electrodomesticos">Electrodomésticos</option>
                    <option value="juguetes">Juguetes</option>
                    <option value="libros">Libros</option>
                    <option value="deportes">Artículos Deportivos</option>
                    <option value="belleza">Belleza y Salud</option>
                    <option value="mascotas">Productos para Mascotas</option>
                    <option value="arte">Arte y Manualidades</option>
                    <option value="automotriz">Accesorios Automotrices</option>
                    <option value="musica">Música y Audio</option>
                </select>
                <button onClick={handleSearchClick} className="search-button">Buscar</button>
            </div>
            <button onClick={() => navigate(-1)} className="back-button">Regresar</button>
            <div className="product-grid">
                {productos.length > 0 ? (
                    productos.map(producto => (
                        <div className="product-card" key={producto.id}>
                            <div className="product-image-container">
                                <img 
                                    src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-image.png"} 
                                    alt={producto.nombre} 
                                    className="product-image" 
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-title">Título: {producto.titulo}</h3>
                                <p className="product-description"><strong>Descripción:</strong> {producto.descripcion}</p>
                                <p className="product-category"><strong>Categoría:</strong> {producto.categoria}</p>
                                <p className="product-contact"><strong>Contacto:</strong> {producto.contacto}</p>
                                <p className="product-price"><strong>Precio:</strong> ${producto.precio}</p>
                                <div className="button-group">
                                    <button onClick={() => handleBuy(producto.id)} className="buy-button">Comprar</button>
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
