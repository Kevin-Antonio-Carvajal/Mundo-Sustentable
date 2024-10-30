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
            setTimeout(() => navigate('/productos-comprados'), 2000);
        } catch (error) {
            console.error('Error añadiendo la opinión:', error.response ? error.response.data : error.message);
            setMensaje('Error añadiendo la opinión');
        }
    };

    return (
        <div>
            <h1>Agregar Opinión</h1>
            <button onClick={() => navigate(-1)} className="button">Regresar</button>
            {mensaje && <p>{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="calificacion">Calificación del producto (1 a 5):</label>
                <input
                    type="number"
                    id="calificacion"
                    value={calificacion}
                    onChange={(e) => setCalificacion(e.target.value)}
                    placeholder="Ej. 4"
                    required
                    min="1"
                    max="5"
                />
                <label htmlFor="comentario">Comentario sobre el producto:</label>
                <textarea
                    id="comentario"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe aquí tu experiencia con el producto"
                    required
                />
                <button type="submit" className='button'>Enviar Opinión</button>
            </form>
        </div>
    );
};

export default OpinionForm;
