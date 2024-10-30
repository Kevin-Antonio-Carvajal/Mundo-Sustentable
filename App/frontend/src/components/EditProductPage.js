import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [contacto, setContacto] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/productos/${productId}`);
        setTitulo(data.nombre);
        setDescripcion(data.descripcion);
        setCategoria(data.categoria);
        setContacto(data.contacto);
        setPrecio(data.precio);
      } catch (error) {
        console.error('Error cargando el producto', error);
        setMensaje('');
      }
    };
    fetchProducto();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/productos/${productId}`, {
        titulo,
        descripcion,
        categoria,
        contacto,
        precio,
      });
      setMensaje('Producto actualizado con éxito');
      setTimeout(() => navigate('/mis-productos'), 2000);
    } catch (error) {
      console.error("Error actualizando el producto", error);
      setMensaje('Error actualizando el producto');
    }
  };

  return (
    <div>
      <h1>Editar Producto</h1>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" required />
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" required></textarea>
        <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoría" required />
        <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Contacto" required />
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" required />
        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default EditProductPage;