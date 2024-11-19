/**
 * Este componente permite a los usuarios agregar una opinión sobre un producto.
 */

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './OpinionForm.css';

const OpinionForm = () => {
    // Estados para almacenar los datos del formulario y mensajes del usuario
    const [calificacion, setCalificacion] = useState('');
    const [comentario, setComentario] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const { productoId } = useParams(); 

    /**
     * Maneja el envío del formulario para agregar una opinión.
     * Envía los datos del formulario a la API y muestra un mensaje de éxito o error.
     * @param {Event} e - Evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const token = localStorage.getItem('token'); // Obtiene el token del usuario
            await axios.post('http://localhost:5000/api/add-opinion', {
                calificacion,
                comentario,
                producto_id: productoId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Agrega el token en los headers para la autenticación
                }
            });
            setMensaje('Opinión añadida con éxito'); 
        } catch (error) {
            console.error('Error añadiendo la opinión:', error.response ? error.response.data : error.message);
            setMensaje('Error añadiendo la opinión'); 
        }
    };

    /**
     * Renderiza el formulario para agregar una opinión.
     * Muestra un botón para regresar y mensajes de estado después de enviar la opinión.
     */
    return (
        <div className="opinion-form-container">
            <h1>Agregar Opinión</h1>
            {/* Botón para regresar a la página anterior */}
            <button onClick={() => navigate(-1)} className="opinion-form-button">Regresar</button>
            {/* Mensaje de éxito o error después de enviar la opinión */}
            {mensaje && <p className={`opinion-form-message ${mensaje.includes('éxito') ? 'success' : 'error'}`}>{mensaje}</p>}
            <form onSubmit={handleSubmit} className="opinion-form">
                <label htmlFor="calificacion" className="opinion-form-label">Calificación del producto (1 a 5):</label>
                {/* Input para la calificación del producto */}
                <input
                    type="number"
                    id="calificacion"
                    className="opinion-form-input"
                    value={calificacion}
                    onChange={(e) => setCalificacion(e.target.value)}
                    placeholder="Ej. 4"
                    required
                    min="1"
                    max="5"
                />
                <label htmlFor="comentario" className="opinion-form-label">Comentario sobre el producto:</label>
                {/* Textarea para el comentario del producto */}
                <textarea
                    id="comentario"
                    className="opinion-form-textarea"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe aquí tu experiencia con el producto"
                    required
                />
                {/* Botón para enviar la opinión */}
                <button type="submit" className='opinion-form-button'>Enviar Opinión</button>
            </form>
        </div>
    );
};

export default OpinionForm;
