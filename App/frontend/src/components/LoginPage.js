import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('comprador'); // Estado inicial para el rol
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleRoleChange = (e) => setRole(e.target.value); // Manejar cambio de rol

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { username, password, role });
            console.log('Login successful:', response.data);
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token); // Almacenamiento del token en localStorage
                localStorage.setItem('role', response.data.role); // Almacenamiento del rol en localStorage si es necesario
                // Redirige al usuario basado en el rol
                if (role === 'comprador') {
                    navigate('/home');
                } else if (role === 'vendedor') {
                    navigate('/menu'); // Asume que tienes una ruta '/menu' para los vendedores.
                }
            } else {
                setError('Login Failed: No token received.');
            }
        } catch (error) {
            setError('Login Failed: Invalid username, password, or role.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" value={username} onChange={handleUsernameChange} placeholder="Usuario" required />
                <input type="password" name="password" value={password} onChange={handlePasswordChange} placeholder="Contraseña" required />
                <select name="role" value={role} onChange={handleRoleChange} required>
                    <option value="comprador">Comprador</option>
                    <option value="vendedor">Vendedor</option>
                </select>
                <button type="submit" className="button">Iniciar Sesión</button>
                <button onClick={() => navigate(-1)} className="button">Regresar</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;