import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Register.scss';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) {
                setError(error.message);
            } else {
                setSuccess('Rejestracja zakończona sukcesem. Możesz się teraz zalogować.');
                navigate('/home');
            }
        } catch (error) {
            setError('Wystąpił błąd podczas rejestracji.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <img src="../public/Logo.jpeg" alt="Logo" style={{ width: '200px', height: '100px', marginBottom: '20px', marginRight: '40px' }} />
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
                    <button type="submit">Zarejestruj się</button>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                </form>
                <p className="signup-text">
                    Masz już konto? <a href="/">Zaloguj się</a>
                </p>
            </div>
            <div className="right-panel"></div>
        </div>
    );
};

export default Register;
