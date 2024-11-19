/** 
 * Permite a los usuarios visualizar, editar y eliminar sus productos registrados. 
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyProductPage.css';

const MyProductsPage = () => {
    const [productos, setProductos] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Carga los productos del usuario cuando el componente se monta
    useEffect(() => {
        fetchProductosUsuario();
    }, []);

    /**
     * Obtiene los productos del usuario desde la API.
     * Verifica si el usuario tiene un token válido y redirige al login si no es así.
     */
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

    /**
     * Cambia el estado de edición de un producto específico.
     * @param {number} productoId - ID del producto a editar.
     */
    const handleEdit = (productoId) => {
        setEditMode({ ...editMode, [productoId]: !editMode[productoId] });
    };

    /**
     * Actualiza el estado local con los cambios realizados en los campos de un producto.
     * @param {string} value - Nuevo valor del campo.
     * @param {string} campo - Campo que se está editando.
     * @param {number} productoId - ID del producto que se está editando.
     */
    const handleChange = (value, campo, productoId) => {
        setProductos(productos.map(producto => producto.id === productoId ? { ...producto, [campo]: value } : producto));
    };

    /**
     * Envía los cambios realizados en un producto al servidor para su actualización.
     * @param {number} productoId - ID del producto que se actualizará.
     */
    const handleSubmit = async (productoId) => {
        const producto = productos.find(p => p.id === productoId);
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/productos/${productoId}`, producto, {
                headers: { Authorization: `Bearer ${token}` }
            });
            handleEdit(productoId); // Desactiva el modo edición después de actualizar
        } catch (error) {
            console.error("Error actualizando el producto", error);
        }
    };

    /**
     * Elimina un producto del servidor y actualiza el estado local.
     * Muestra un mensaje de error si la eliminación falla debido a integridad referencial.
     * @param {number} productoId - ID del producto que se eliminará.
     */
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
                    setErrorMessage("No se puede eliminar el producto porque está vinculado a una compra existente.");
                } else {
                    console.error("Error eliminando el producto", error);
                }
            }
        }
    };

/**
 * Renderiza la interfaz de usuario con los productos del usuario.
 * Incluye botones para editar, eliminar y ver opiniones de los productos.
 */
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
                                        <option value="alimentos">Alimentos Orgánicos</option>
                                        <option value="frutas_y_verduras">Frutas y Verduras</option>
                                        <option value="productos_de_limpieza">Productos de Limpieza</option>
                                        <option value="desechables">Utensilios Desechables</option>
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
