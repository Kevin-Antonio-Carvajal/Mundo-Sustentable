import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './OpinionsPage.css';

const OpinionsPage = () => {
    const { productoId } = useParams();
    const [opiniones, setOpiniones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpiniones = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/opiniones/${productoId}`);
                setOpiniones(data);
            } catch (error) {
                console.error('Error cargando las opiniones', error);
            } finally {
                setCargando(false);
            }
        };
        fetchOpiniones();
    }, [productoId]);

    if (cargando) {
        return <div className="opinions-page-loading">Cargando...</div>;
    }

    if (opiniones.length === 0) {
        return (
            <div className="opinions-page-no-opinions">
                <p>No hay opiniones para este producto.</p>
                <button onClick={() => navigate(-1)} className="opinions-page-button">Regresar</button>
            </div>
        );
    }

    return (
        <div className="opinions-page-container">
            <h1>Opiniones del Producto</h1>
            <button onClick={() => navigate(-1)} className="opinions-page-button">Regresar</button>
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
