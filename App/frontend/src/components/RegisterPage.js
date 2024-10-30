import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Paso 1: Importar useNavigate
import './RegisterPage.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('comprador');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Limpiar mensajes previos

        // Validar teléfono (debe ser un número de 10 dígitos)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('El número de teléfono debe tener 10 dígitos.');
            return;
        }

        // Validar longitud del nombre de usuario
        if (username.length < 3 || username.length > 20) {
            alert('El nombre de usuario debe tener entre 3 y 20 caracteres.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/register', {
                email,
                phone,
                username,
                password,
                role
            });
            console.log(response.data);
            alert('Usuario registrado con éxito.'); // Establece el mensaje de éxito
            setTimeout(() => navigate('/'), 500); // Redirecciona después de 2 segundos
        } catch (error) {
            if (error.response && error.response.data) {
                // Suponiendo que el servidor envía el mensaje en error.response.data.alert
                alert(`Error al registrar: ${error.response.data.alert}`);
            } else {
                alert('Error al registrar usuario. Intente de nuevo.');
            }
            console.error(error);
        }
    };

    return (
        <div className="container">
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <label for="nombre">
                    Usuario:
                    <input type="text" id="nombre" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label for="email">
                    Correo electrónico:
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label for="password">
                    Contraseña:
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <label for="telefono">
                    Teléfono:
                    <input type="text" id="telefono" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label for="rol">
                    Rol:
                    <select id="rol" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Selecciona un rol</option>
                        <option value="comprador">Comprador</option>
                        <option value="vendedor">Vendedor</option>
                    </select>
                </label>
                <button type="submit" className="button">Registrar</button>
                <button onClick={() => navigate(-1)} className="button">Regresar</button>
                {message && <p className="error-message">{message}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;