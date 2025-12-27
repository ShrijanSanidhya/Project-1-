import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const AVATARS = [
    { id: 1, url: 'https://img.freepik.com/free-photo/view-3d-future-robot_23-2150833297.jpg', name: 'Cyber' },
    { id: 2, url: 'https://img.freepik.com/free-photo/futuristic-robot-with-glowing-blue-eyes_23-2149340243.jpg', name: 'Atlas' },
    { id: 3, url: 'https://img.freepik.com/free-photo/cyborg-woman-with-blue-eyes_23-2149340263.jpg', name: 'Nova' },
    { id: 4, url: 'https://img.freepik.com/free-photo/robot-face-close-up-3d-rendering_1142-42774.jpg', name: 'Titan' },
];

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        assistantName: '',
        assistantImage: ''
    });

    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { email, password, assistantName, assistantImage } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const selectAvatar = (url) => setFormData({ ...formData, assistantImage: url });

    const nextStep = (e) => {
        e.preventDefault();
        if (!email || !password || !assistantName) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        setStep(2);
    };

    const prevStep = () => setStep(1);

    const onSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const finalImage = assistantImage || AVATARS[0].url;
            await register(email, password, assistantName, finalImage);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Signup failed');
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
            maxWidth: '500px',
            position: 'relative',
            overflow: 'hidden',
            background: 'rgba(0, 0, 0, 0.4)'
        },
        progressBar: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '4px',
            backgroundColor: '#3b82f6',
            transition: 'width 0.3s ease',
            width: step === 1 ? '50%' : '100%'
        },
        title: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#60a5fa',
            marginBottom: '8px'
        },
        subtitle: {
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '0.875rem',
            marginBottom: '32px'
        },
        inputWrapper: {
            position: 'relative',
            marginBottom: '16px'
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
            padding: '12px 12px 12px 40px',
            boxSizing: 'border-box'
        },
        buttonPrimary: {
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '32px'
        },
        buttonSecondary: {
            width: '33%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        avatarGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '32px'
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
            marginTop: '24px',
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass"
                style={styles.card}
            >
                <div style={styles.progressBar}></div>

                <h2 style={styles.title} className="neon-text">
                    {step === 1 ? 'Register System' : 'Install Avatar'}
                </h2>
                <p style={styles.subtitle}>
                    {step === 1 ? 'Initialize your personal AI assistant' : 'Select the visual interface for your AI'}
                </p>

                {error && <div style={styles.error}>{error}</div>}

                {step === 1 ? (
                    <form onSubmit={nextStep}>
                        <div style={styles.inputWrapper}>
                            <UserIcon style={styles.icon} size={20} />
                            <input
                                type="text"
                                name="assistantName"
                                value={assistantName}
                                onChange={onChange}
                                required
                                className="glass-input"
                                style={styles.input}
                                placeholder="Assistant Name"
                            />
                        </div>
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
                            style={styles.buttonPrimary}
                            onMouseOver={(e) => e.target.style.boxShadow = '0 0 25px rgba(37, 99, 235, 0.7)'}
                            onMouseOut={(e) => e.target.style.boxShadow = '0 0 15px rgba(37, 99, 235, 0.5)'}
                        >
                            Next <ArrowRight style={{ marginLeft: '8px' }} size={20} />
                        </button>
                    </form>
                ) : (
                    <div>
                        <div style={styles.avatarGrid}>
                            {AVATARS.map((avatar) => (
                                <motion.div
                                    key={avatar.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => selectAvatar(avatar.url)}
                                    style={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: assistantImage === avatar.url ? '2px solid #3b82f6' : '2px solid transparent',
                                        boxShadow: assistantImage === avatar.url ? '0 0 15px rgba(59, 130, 246, 0.6)' : 'none',
                                        opacity: assistantImage === avatar.url ? 1 : 0.7,
                                        height: '128px'
                                    }}
                                >
                                    <img src={avatar.url} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {assistantImage === avatar.url && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Check color="white" size={32} style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                onClick={prevStep}
                                style={styles.buttonSecondary}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                onClick={onSubmit}
                                disabled={loading}
                                style={{ ...styles.buttonPrimary, marginTop: 0, width: '66%' }}
                            >
                                {loading ? 'Initializing...' : 'Sign Up'}
                            </button>
                        </div>
                    </div>
                )}

                <p style={styles.footer}>
                    Already have an account? <Link to="/login" style={styles.link} className="neon-text">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
