import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './OpinionForm.css';

const OpinionForm = () => {
    const [calificacion, setCalificacion] = useState('');
    const [comentario, setComentario] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const { productoId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/add-opinion', {
                calificacion,
                comentario,
                producto_id: productoId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMensaje('Opinión añadida con éxito');
        } catch (error) {
            console.error('Error añadiendo la opinión:', error.response ? error.response.data : error.message);
            setMensaje('Error añadiendo la opinión');
        }
    };

    return (
        <div className="opinion-form-container">
            <h1>Agregar Opinión</h1>
            <button onClick={() => navigate(-1)} className="opinion-form-button">Regresar</button>
            {mensaje && <p className={`opinion-form-message ${mensaje.includes('éxito') ? 'success' : 'error'}`}>{mensaje}</p>}
            <form onSubmit={handleSubmit} className="opinion-form">
                <label htmlFor="calificacion" className="opinion-form-label">Calificación del producto (1 a 5):</label>
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
                <textarea
                    id="comentario"
                    className="opinion-form-textarea"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe aquí tu experiencia con el producto"
                    required
                />
                <button type="submit" className='opinion-form-button'>Enviar Opinión</button>
            </form>
        </div>
    );
};

export default OpinionForm;
