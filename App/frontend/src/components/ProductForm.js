/**
 * Este componente permite a los usuarios registrar nuevos productos.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = () => {
  // Estados para almacenar los valores de los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [contacto, setContacto] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState(''); 
  const [isSuccess, setIsSuccess] = useState(null); 

  const navigate = useNavigate();

  /**
   * Verifica si el usuario está autenticado al cargar el componente.
   * Si no hay un token en el almacenamiento local, redirige al login.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  /**
   * Maneja el envío del formulario.
   * Envía los datos del producto a la API para su registro.
   * @param {Event} e - Evento de formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepara los datos del formulario en formato FormData para manejar archivos
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('foto', foto);
    formData.append('categoria', categoria);
    formData.append('contacto', contacto);
    formData.append('precio', precio);

    try {
      const token = localStorage.getItem('token');
      // Realiza una solicitud POST a la API para registrar el producto
      const response = await axios.post('http://localhost:5000/api/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setMensaje("Producto registrado con éxito: " + response.data.message);
      setIsSuccess(true);
      // Redirige al menú después de 2 segundos
      setTimeout(() => navigate('/menu'), 2000);
    } catch (error) {
      // Maneja errores y muestra un mensaje apropiado
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error al registrar el producto. Intente de nuevo.";
      setMensaje(errorMessage);
      setIsSuccess(false);
    }
  };

  /**
   * Maneja el cambio del archivo seleccionado.
   * Valida que el archivo sea una imagen JPG o PNG.
   * @param {Event} event - Evento de cambio de archivo.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setFoto(file);
      setMensaje('');
    } else {
      setMensaje("Solo se permiten archivos JPG o PNG.");
      setIsSuccess(false);
      event.target.value = null; // Limpia el archivo seleccionado
    }
  };

  /**
   * Quita la foto seleccionada del estado.
   */
  const removePhoto = () => {
    setFoto(null);
  };

/**
 * Renderiza el formulario de registro de productos.
 */
return (
  <div className="product-form-container">
    <h1>Alta de Productos</h1>
    {/* Mensaje de éxito o error */}
    {mensaje && (
      <div className={`product-form-message ${isSuccess ? 'success' : 'error'}`}>
        {mensaje}
      </div>
    )}
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título"
        required
      />
      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
        required
      />

      <div className="file-button-group">
        {/* Botón para seleccionar archivo */}
        <button
          type="button"
          className="product-form-button"
          onClick={() => document.getElementById('fileInput').click()}
        >
          Seleccionar Archivo
        </button>
        {foto && (
          <button
            type="button"
            onClick={removePhoto}
            className="product-form-button remove-button"
          >
            Quitar Foto
          </button>
        )}
      </div>

      {/* Entrada de archivo oculta */}
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        accept="image/jpeg, image/png"
        style={{ display: 'none' }}
        required
      />

      {/* Selector de categoría */}
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
        <option value="">Seleccione una categoría</option>
        <option value="alimentos">Alimentos Orgánicos</option>
        <option value="frutas_y_verduras">Frutas y Verduras</option>
        <option value="productos_de_limpieza">Productos de Limpieza</option>
        <option value="desechables">Utensilios Desechables</option>
      </select>

      <input
        type="text"
        value={contacto}
        onChange={(e) => setContacto(e.target.value)}
        placeholder="Contacto (correo)"
        required
      />
      <input
        type="number"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio MXN"
        step="1.00"
        min="1"
        required
      />

      {/* Botones del formulario */}
      <div className="product-form-button-group">
        <button className="product-form-button" type="submit">
          Registrar Producto
        </button>
        <button onClick={() => navigate(-1)} className="product-form-button">
          Regresar
        </button>
      </div>
    </form>
  </div>
);
};

export default ProductForm;
