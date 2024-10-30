import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyProductPage.css';

const MyProductsPage = () => {
    const [productos, setProductos] = useState([]);
    const [editMode, setEditMode] = useState({});
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
            let editModes = {};
            data.forEach(producto => {
                editModes[producto.id] = false; // Todos los productos inicialmente no están en modo edición
            });
            setEditMode(editModes);
        } catch (error) {
            console.error("Error cargando los productos del usuario", error);
        }
    };

    const handleEdit = (productoId) => {
        setEditMode({ ...editMode, [productoId]: !editMode[productoId] });
    };

    const handleChange = (value, campo, productoId) => {
        const newProductos = productos.map(producto => {
            if (producto.id === productoId) {
                return { ...producto, [campo]: value };
            }
            return producto;
        });
        setProductos(newProductos);
    };

    const handleSubmit = async (productoId) => {
        const producto = productos.find(p => p.id === productoId);
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/productos/${productoId}`, producto, {
                headers: { Authorization: `Bearer ${token}` }
            });
            handleEdit(productoId); // Desactivar modo edición después de actualizar
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
                console.error("Error eliminando el producto", error);
            }
        }
    };

    return (
        <div className='my-products-page'>
            <h2>Mis Productos</h2>
            <button onClick={() => navigate(-1)} className="button">Regresar</button>
            {productos.length > 0 ? (
                <div className='products-container'>
{productos.map((producto) => (
    <div key={producto.id} className='product-item'>
        <img src={producto.imagen ? `http://localhost:5000/uploads/${encodeURIComponent(producto.imagen.split('/').pop())}` : "placeholder-imagen.png"} alt={producto.titulo} className="product-image" />
        {editMode[producto.id] ? (
            <>
                <input type="text" value={producto.titulo} onChange={(e) => handleChange(e.target.value, 'titulo', producto.id)} />
                <textarea rows="3" value={producto.descripcion} onChange={(e) => handleChange(e.target.value, 'descripcion', producto.id)} />
                <select value={producto.categoria} onChange={(e) => handleChange(e.target.value, 'categoria', producto.id)}>
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
                <input type="text" value={producto.contacto} onChange={(e) => handleChange(e.target.value, 'contacto', producto.id)} />
                <input type="number" value={producto.precio} onChange={(e) => handleChange(e.target.value, 'precio', producto.id)} />
                <button onClick={() => handleSubmit(producto.id)} className="button">Guardar</button>
            </>
        ) : (
            <>
                <p>{producto.titulo}</p>
                <p>{producto.descripcion}</p>
                <p>Categoría: {producto.categoria}</p>
                <p>Contacto: {producto.contacto}</p>
                <p>Precio: ${producto.precio}</p>
                <button onClick={() => handleEdit(producto.id)} className="button">Editar</button>
            </>
        )}
        <button onClick={() => handleDelete(producto.id)} className="button">Eliminar</button>
    </div>
))}
                </div>
            ) : (
                <div>No tienes productos listados aún.</div>
            )}
        </div>
    );
};

export default MyProductsPage;

