/**
 * Página para editar un producto existente.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProductPage.css';

const EditProductPage = () => {
  // Obtiene el ID del producto desde los parámetros de la URL.
  const { productId } = useParams();
  const navigate = useNavigate();

  // Estados para almacenar los datos del producto y los mensajes.
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [contacto, setContacto] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');

  /**
   * Efecto para cargar los datos del producto al renderizar la página.
   * Llama a la API para obtener los datos y los establece en el estado.
   */
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

  /**
   * Maneja el envío del formulario.
   * Realiza una solicitud PUT a la API para actualizar el producto.
   * Muestra un mensaje de éxito o error basado en la respuesta.
   */
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

  // Renderiza el formulario para editar el producto.
  return (
    <div className="edit-product-container">
      <h1>Editar Producto</h1>
      {mensaje && <p className="edit-product-message">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="edit-product-form">
        <input 
          type="text" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          placeholder="Título" 
          required 
          className="edit-product-input" 
        />
        <textarea 
          value={descripcion} 
          onChange={(e) => setDescripcion(e.target.value)} 
          placeholder="Descripción" 
          required 
          className="edit-product-textarea"
        ></textarea>
        <input 
          type="text" 
          value={categoria} 
          onChange={(e) => setCategoria(e.target.value)} 
          placeholder="Categoría" 
          required 
          className="edit-product-input" 
        />
        <input 
          type="text" 
          value={contacto} 
          onChange={(e) => setContacto(e.target.value)} 
          placeholder="Contacto" 
          required 
          className="edit-product-input" 
        />
        <input 
          type="number" 
          value={precio} 
          onChange={(e) => setPrecio(e.target.value)} 
          placeholder="Precio" 
          required 
          className="edit-product-input" 
        />
        <button type="submit" className="edit-product-button">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default EditProductPage;
