import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyProductPage.css';

const MyProductsPage = () => {
    const [productos, setProductos] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [errorMessage, setErrorMessage] = useState(''); // Para almacenar mensajes de error
    const navigate = useNavigate();

    useEffect(() => {
        fetchProductosUsuario();
    }, []);

    const fetchProductosUsuario = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const { data } = await axios.get('http://localhost:5000/api/mis-productos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProductos(data);
            setEditMode(data.reduce((acc, producto) => ({ ...acc, [producto.id]: false }), {}));
        } catch (error) {
            console.error("Error cargando los productos del usuario", error);
        }
    };

    const handleEdit = (productoId) => {
        setEditMode({ ...editMode, [productoId]: !editMode[productoId] });
    };

    const handleChange = (value, campo, productoId) => {
        setProductos(productos.map(producto => producto.id === productoId ? { ...producto, [campo]: value } : producto));
    };

    const handleSubmit = async (productoId) => {
        const producto = productos.find(p => p.id === productoId);
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/productos/${productoId}`, producto, {
                headers: { Authorization: `Bearer ${token}` }
            });
            handleEdit(productoId);
        } catch (error) {
            console.error("Error actualizando el producto", error);
        }
    };

    const handleDelete = async (productoId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (window.confirm('¿Estás seguro de querer eliminar este producto?')) {
            try {
                await axios.delete(`http://localhost:5000/api/productos/${productoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProductos(productos.filter(producto => producto.id !== productoId));
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    // Error de integridad referencial
                    setErrorMessage("No se puede eliminar el producto porque está vinculado a una compra existente.");
                } else {
                    console.error("Error eliminando el producto", error);
                }
            }
        }
    };

    return (
        <div className='my-products-page'>
            <h2 className="my-products-title">Mis Productos</h2>
            <button onClick={() => navigate(-1)} className="my-products-back-button">Regresar</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Mostrar mensaje de error */}
            {productos.length > 0 ? (
                <div className='my-products-container'>
                    {productos.map((producto) => (
                        <div key={producto.id} className='my-products-item'>
                            <div className="my-products-image-container">
                                <img src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-imagen.png"} alt={producto.titulo} className="my-products-image" />
                            </div>
                            <div className="my-products-details">
                                {editMode[producto.id] ? (
                                    <>
                                        <input type="text" className="my-products-input-full" value={producto.titulo} onChange={(e) => handleChange(e.target.value, 'titulo', producto.id)} />
                                        <textarea className="my-products-textarea" rows="3" value={producto.descripcion} onChange={(e) => handleChange(e.target.value, 'descripcion', producto.id)} />
                                        <select className="my-products-select" value={producto.categoria} onChange={(e) => handleChange(e.target.value, 'categoria', producto.id)}>
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
                                        <input type="text" className="my-products-input" value={producto.contacto} onChange={(e) => handleChange(e.target.value, 'contacto', producto.id)} />
                                        <input type="number" className="my-products-input" value={producto.precio} onChange={(e) => handleChange(e.target.value, 'precio', producto.id)} />
                                        <button onClick={() => handleSubmit(producto.id)} className="my-products-save-button">Guardar</button>
                                    </>
                                ) : (
                                    <>
                                        <p className="my-products-title"><strong>Título:</strong> {producto.titulo}</p>
                                        <p className="my-products-description"><strong>Descripción:</strong> {producto.descripcion}</p>
                                        <p className="my-products-category"><strong>Categoría:</strong> {producto.categoria}</p>
                                        <p className="my-products-contact"><strong>Contacto:</strong> {producto.contacto}</p>
                                        <p className="my-products-price"><strong>Precio:</strong> ${producto.precio}</p>
                                        <div className="my-products-button-group">
                                            <button onClick={() => handleEdit(producto.id)} className="my-products-edit-button">Editar</button>
                                            <button onClick={() => handleDelete(producto.id)} className="my-products-delete-button">Eliminar</button>
                                            <button onClick={() => navigate(`/producto/${producto.id}/opiniones`)} className="my-products-opinions-button">Ver Opiniones</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="my-products-empty-message">No tienes productos listados aún.</div>
            )}
        </div>
    );
};

export default MyProductsPage;
