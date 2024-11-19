/**
 * Este componente muestra las opiniones relacionadas con un producto específico.
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './OpinionsPage.css';

const OpinionsPage = () => {
    const { productoId } = useParams();
    const [opiniones, setOpiniones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    /**
     * Hook useEffect para cargar las opiniones al montar el componente.
     * Llama a la API para obtener las opiniones relacionadas con el producto.
     */
    useEffect(() => {
        const fetchOpiniones = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/opiniones/${productoId}`);
                setOpiniones(data); // Almacena las opiniones en el estado
            } catch (error) {
                console.error('Error cargando las opiniones', error);
            } finally {
                setCargando(false); // Cambia el estado de carga
            }
        };
        fetchOpiniones();
    }, [productoId]); 

    // Muestra un mensaje de carga mientras se obtienen las opiniones
    if (cargando) {
        return <div className="opinions-page-loading">Cargando...</div>;
    }

    // Muestra un mensaje si no hay opiniones disponibles
    if (opiniones.length === 0) {
        return (
            <div className="opinions-page-no-opinions">
                <p>No hay opiniones para este producto.</p>
                <button onClick={() => navigate(-1)} className="opinions-page-button">Regresar</button>
            </div>
        );
    }

    /**
     * Renderiza las opiniones y un botón para regresar a la página anterior.
     */
    return (
        <div className="opinions-page-container">
            <h1>Opiniones del Producto</h1>
            {/* Botón para regresar a la página anterior */}
            <button onClick={() => navigate(-1)} className="opinions-page-button">Regresar</button>
            {/* Muestra cada opinión en una tarjeta */}
            {opiniones.map(opinion => (
                <div key={opinion.opinion_id} className="opinions-page-item">
                    <p><strong>Usuario:</strong> {opinion.nombre_usuario}</p>
                    <p><strong>Calificación:</strong> {opinion.calificacion}</p>
                    <p><strong>Comentario:</strong> {opinion.comentario}</p>
                </div>
            ))}
        </div>
    );
};

export default OpinionsPage;
