import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import './Login.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                console.error('Login error:', error.message);
                setError(error.message);
            } else if (data) {
                navigate('/home');
            } else {
                setError('Nieznany błąd podczas logowania.');
            }
        } catch (error) {
            console.error('Unexpected login error:', error);
            setError('Wystąpił niespodziewany błąd podczas logowania.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <img src="/Logo.jpeg" alt="Logo" style={{ width: '200px', height: '100px', marginRight: '40px', marginBottom: '20px' }} />
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Zaloguj się</button>
                    {error && <p className="error">{error}</p>}
                </form>
                <p className="signup-text">
                    Nie masz konta? <a href="/signup">Zarejestruj się</a>
                </p>
            </div>
            <div className="right-panel"></div>
        </div>
    );
};

export default Login;
