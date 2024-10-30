import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './ProductListPage.css'; // Asegúrate de que el archivo CSS esté correctamente vinculado
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
    }, [navigate, searchCategory]); // Añade navigate y searchCategory como dependencias

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]); // Ahora fetchProductos es una dependencia, por lo que se incluye aquí

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
        <div className="product-list">
            <div className="search-container">
                <select value={searchCategory} onChange={handleCategoryChange} className="category-select">
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
                <button onClick={handleSearchClick} className="button">Buscar</button>
            </div>
            <button onClick={() => navigate(-1)} className="button">Regresar</button>
            {productos.length > 0 ? (
                productos.map(producto => (
                    <div className="product-item" key={producto.id}>
                        <img src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-image.png"} alt={producto.nombre} className="product-image" />
                        <div className="product-details">
                            <div className="product-name">{producto.nombre}</div>
                            <div className="product-description">{producto.descripcion}</div>
                            <div>
                                <button onClick={() => navigate(`/producto/${producto.id}`)} className="button">Ver Detalles</button>
                                <button onClick={() => navigate(`/producto/${producto.id}/opiniones`)} className="button">Ver Opiniones</button>
                                <button onClick={() => handleBuy(producto.id)} className="button">Comprar</button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>No hay productos disponibles.</div>
            )}
        </div>
    );
};

export default ProductListPage;
