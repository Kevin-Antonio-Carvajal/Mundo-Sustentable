import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('comprador');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleRoleChange = (e) => setRole(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { username, password, role });
            console.log('Login successful:', response.data);
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('role', response.data.role);
                if (role === 'comprador') {
                    navigate('/home');
                } else if (role === 'vendedor') {
                    navigate('/menu');
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
        <div className="login-page-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="login-page-form">
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Usuario"
                    required
                    className="login-page-input"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Contraseña"
                    required
                    className="login-page-input"
                />
                <select name="role" value={role} onChange={handleRoleChange} required className="login-page-select">
                    <option value="comprador">Comprador</option>
                    <option value="vendedor">Vendedor</option>
                </select>
                <div className="login-page-button-group">
                    <button type="submit" className="login-page-button">Iniciar Sesión</button>
                    <button type="button" onClick={() => navigate(-1)} className="login-page-button">Regresar</button>
                </div>
                {error && <p className="login-page-error-message">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
