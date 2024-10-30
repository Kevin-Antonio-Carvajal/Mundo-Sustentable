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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirige al usuario a la página de login si no está autenticado
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
      setTimeout(() => navigate('/menu'), 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMensaje("Error al registrar el producto: " + error.response.data.message);
      } else if (error.response && error.response.data) {
        const errors = error.response.data.errors ? Object.values(error.response.data.errors).join(', ') : '';
        setMensaje("Error al registrar el producto. Por favor, verifica los datos ingresados. " + errors);
      } else {
        setMensaje("Error al registrar el producto: Ha ocurrido un problema de conexión.");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setFoto(file);
      setMensaje('');
    } else {
      setMensaje("Solo se permiten archivos JPG o PNG.");
      event.target.value = null; // Reset del input file
    }
  };

  const removePhoto = () => {
    setFoto(null);
  };

  return (
    <div className="form-container">
      <h1>Alta de Productos</h1>
      {mensaje && <div className="mensaje">{mensaje}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" required />
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" required />
        <button type="button" className="button" onClick={() => document.getElementById('fileInput').click()}>Seleccionar Archivo</button>
        <input type="file" id="fileInput" onChange={handleFileChange} accept="image/jpeg, image/png" style={{ display: 'none' }} required />
        {foto && <button type="button" onClick={removePhoto} className="button remove-button">Quitar Foto</button>}
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
        <button className='button' type="submit">Registrar Producto</button>
        <button onClick={() => navigate(-1)} className="button">Regresar</button>
      </form>
    </div>
  );
};

export default ProductForm;
