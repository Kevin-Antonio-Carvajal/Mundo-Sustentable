/**
 * Este componente permite a los usuarios registrarse en la aplicación 
 */

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    // Estados para manejar los datos del formulario de registro
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('comprador'); 
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    /**
     * Maneja el envío del formulario de registro.
     * Valida los campos y realiza la solicitud POST a la API para registrar al usuario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 

        // Valida que el teléfono tenga 10 dígitos
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('El número de teléfono debe tener 10 dígitos.');
            return;
        }

        // Valida la longitud del nombre de usuario
        if (username.length < 3 || username.length > 20) {
            alert('El nombre de usuario debe tener entre 3 y 20 caracteres.');
            return;
        }

        try {
            // Realiza la solicitud POST para registrar al usuario
            const response = await axios.post('http://localhost:5000/auth/register', {
                email,
                phone,
                username,
                password,
                role
            });
            console.log(response.data);
            alert('Usuario registrado con éxito.');
            setTimeout(() => navigate('/'), 500); // Redirige a la página principal tras un breve retraso
        } catch (error) {
            if (error.response && error.response.data) {
                alert(`Error al registrar: ${error.response.data.alert}`);
            } else {
                alert('Error al registrar usuario. Intente de nuevo.');
            }
            console.error(error);
        }
    };

    return (
        <div className="container">
            {/* Título de la página */}
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                {/* Campo para el nombre de usuario */}
                <div className="form-group">
                    <label htmlFor="nombre">Usuario:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                {/* Campo para el correo electrónico */}
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {/* Campo para la contraseña */}
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* Campo para el número de teléfono */}
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                        type="text"
                        id="telefono"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                {/* Campo para seleccionar el rol del usuario */}
                <div className="form-group">
                    <label htmlFor="rol">Rol:</label>
                    <select
                        id="rol"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="comprador">Comprador</option>
                        <option value="vendedor">Vendedor</option>
                    </select>
                </div>
                {/* Botones para registrar o regresar */}
                <div className="button-group">
                    <button type="submit" className="button">Registrar</button>
                    <button type="button" onClick={() => navigate(-1)} className="button">Regresar</button>
                </div>
                {/* Mensaje de error o éxito */}
                {message && <p className="error-message">{message}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
