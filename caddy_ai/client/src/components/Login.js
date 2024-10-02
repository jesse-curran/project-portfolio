import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setLoading, setError }) {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setMessage('Login successful!');
                navigate('/courses');
            } else {
                setError('Login failed: ' + data.message);
            }
        } catch (error) {
            setError('Login error: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [loginEmail, loginPassword, setLoading, setError, navigate]);

    const handleRegister = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: registerUsername, email: registerEmail, password: registerPassword })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Registration successful! Please log in.');
            } else {
                setError('Registration failed: ' + data.message);
            }
        } catch (error) {
            setError('Registration error: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [registerUsername, registerEmail, registerPassword, setLoading, setError]);

    const testBackendConnection = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/');
            const data = await response.text();
            setMessage('Backend connection successful: ' + data);
        } catch (error) {
            setError('Backend connection failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>

            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="text" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} placeholder="Username" required />
                <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Register</button>
            </form>

            <button onClick={testBackendConnection}>Test Backend Connection</button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;