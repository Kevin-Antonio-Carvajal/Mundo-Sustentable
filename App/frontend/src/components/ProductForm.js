import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [contacto, setContacto] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('foto', foto);
    formData.append('categoria', categoria);
    formData.append('contacto', contacto);
    formData.append('precio', precio);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setMensaje("Producto registrado con éxito: " + response.data.message);
      setIsSuccess(true);
      setTimeout(() => navigate('/menu'), 2000);
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error al registrar el producto. Intente de nuevo.";
      setMensaje(errorMessage);
      setIsSuccess(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setFoto(file);
      setMensaje('');
    } else {
      setMensaje("Solo se permiten archivos JPG o PNG.");
      setIsSuccess(false);
      event.target.value = null;
    }
  };

  const removePhoto = () => {
    setFoto(null);
  };

  return (
    <div className="product-form-container">
      <h1>Alta de Productos</h1>
      {mensaje && (
        <div className={`product-form-message ${isSuccess ? 'success' : 'error'}`}>
          {mensaje}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" required />
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" required />
        
        <div className="file-button-group">
          <button type="button" className="product-form-button" onClick={() => document.getElementById('fileInput').click()}>Seleccionar Archivo</button>
          {foto && <button type="button" onClick={removePhoto} className="product-form-button remove-button">Quitar Foto</button>}
        </div>
        
        <input type="file" id="fileInput" onChange={handleFileChange} accept="image/jpeg, image/png" style={{ display: 'none' }} required />

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
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

        <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Contacto (correo)" required />
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio MXN" step="1.00" min="1" required />
        
        <div className="product-form-button-group">
          <button className='product-form-button' type="submit">Registrar Producto</button>
          <button onClick={() => navigate(-1)} className="product-form-button">Regresar</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
