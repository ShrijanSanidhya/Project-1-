import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
        },
        card: {
            padding: '40px',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            position: 'relative',
            background: 'rgba(0, 0, 0, 0.4)' // slightly darker glass for contrast
        },
        title: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#60a5fa', // blue-400
            textAlign: 'center',
            marginBottom: '8px'
        },
        subtitle: {
            color: '#9ca3af', // gray-400
            fontSize: '0.875rem',
            textAlign: 'center',
            marginBottom: '32px'
        },
        inputWrapper: {
            position: 'relative',
            marginBottom: '20px'
        },
        icon: {
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#60a5fa'
        },
        input: {
            width: '100%',
            padding: '12px 12px 12px 40px', // padding left accommodates icon
            boxSizing: 'border-box'
        },
        button: {
            width: '100%',
            backgroundColor: '#2563eb', // blue-600
            color: 'white',
            fontWeight: 'bold',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
            marginTop: '10px'
        },
        error: {
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            color: '#fee2e2',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
        },
        footer: {
            marginTop: '32px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '0.875rem'
        },
        link: {
            color: '#60a5fa',
            textDecoration: 'none',
            marginLeft: '4px'
        }
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={styles.card}
            >
                <div>
                    <h2 style={styles.title} className="neon-text">JARVIS</h2>
                    <p style={styles.subtitle}>Welcome back, Sir.</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={onSubmit}>
                    <div style={styles.inputWrapper}>
                        <Mail style={styles.icon} size={20} />
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="glass-input"
                            style={styles.input}
                            placeholder="Email Address"
                        />
                    </div>

                    <div style={styles.inputWrapper}>
                        <Lock style={styles.icon} size={20} />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            className="glass-input"
                            style={styles.input}
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                        onMouseOver={(e) => e.target.style.boxShadow = '0 0 25px rgba(37, 99, 235, 0.7)'}
                        onMouseOut={(e) => e.target.style.boxShadow = '0 0 15px rgba(37, 99, 235, 0.5)'}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Don't have an account? <Link to="/signup" style={styles.link} className="neon-text">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
