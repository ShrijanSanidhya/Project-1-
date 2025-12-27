import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, User as UserIcon, Check, Upload, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

// Avatar Placeholders
const AVATARS = [
    { id: 1, url: 'https://img.freepik.com/free-photo/view-3d-future-robot_23-2150833297.jpg', name: 'Cyber' },
    { id: 2, url: 'https://img.freepik.com/free-photo/futuristic-robot-with-glowing-blue-eyes_23-2149340243.jpg', name: 'Atlas' },
    { id: 3, url: 'https://img.freepik.com/free-photo/cyborg-woman-with-blue-eyes_23-2149340263.jpg', name: 'Nova' },
    { id: 4, url: 'https://img.freepik.com/free-photo/robot-face-close-up-3d-rendering_1142-42774.jpg', name: 'Titan' },
];

const Settings = () => {
    const { user, updateAssistant } = useAuth();
    const [name, setName] = useState(user?.assistantName || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.assistantImage || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleNameChange = (e) => setName(e.target.value);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMsg('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Upload success:", res.data);
            setSelectedAvatar(res.data.url);
            setMsg('Image uploaded! Click Save to apply.');
        } catch (err) {
            console.error("Upload error:", err);
            setMsg('Error uploading image.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        try {
            const res = await api.put('/user/customize', {
                assistantName: name,
                assistantImage: selectedAvatar
            });
            updateAssistant(res.data);
            setMsg('Configuration Saved Successfully!');
        } catch (err) {
            console.error(err);
            setMsg('Error saving changes.');
        } finally {
            setLoading(false);
        }
    };

    // Styles Object
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative'
        },
        backButton: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'flex',
            alignItems: 'center',
            color: '#60a5fa', // Blue-400
            textDecoration: 'none',
            background: 'rgba(255,255,255,0.1)',
            padding: '10px 20px',
            borderRadius: '9999px',
            zIndex: 10
        },
        card: {
            padding: '40px',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '800px',
            margin: '40px 0'
        },
        title: {
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: '#60a5fa',
            textShadow: '0 0 10px rgba(59, 130, 246, 0.7)'
        },
        msgBox: (isError) => ({
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'center',
            backgroundColor: isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            border: `1px solid ${isError ? '#ef4444' : '#22c55e'}`,
            color: isError ? '#fee2e2' : '#dcfce7'
        }),
        sectionLabel: {
            display: 'block',
            color: '#93c5fd', // Blue-300
            marginBottom: '10px',
            fontWeight: '600',
            letterSpacing: '0.05em'
        },
        inputWrapper: {
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            marginBottom: '2rem'
        },
        avatarGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '16px',
            marginTop: '16px'
        },
        avatarOption: (isSelected) => ({
            position: 'relative',
            cursor: 'pointer',
            borderRadius: '12px',
            overflow: 'hidden',
            border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
            boxShadow: isSelected ? '0 0 15px rgba(59, 130, 246, 0.6)' : 'none',
            opacity: isSelected ? 1 : 0.6,
            transition: 'all 0.3s ease',
            aspectRatio: '1 / 1'
        }),
        saveButton: {
            width: '100%',
            marginTop: '32px',
            background: 'linear-gradient(to right, #2563eb, #06b6d4)',
            color: 'white',
            fontWeight: 'bold',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
        },
        uploadLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            background: 'rgba(37, 99, 235, 0.2)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#93c5fd',
            border: '1px solid rgba(59, 130, 246, 0.3)'
        }
    };

    return (
        <div style={styles.container}>
            <Link to="/dashboard" style={styles.backButton}>
                <ArrowLeft style={{ marginRight: '8px' }} size={18} /> Back
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass"
                style={styles.card}
            >
                <h2 style={styles.title}>System Configuration</h2>

                {msg && <div style={styles.msgBox(msg.includes('Error'))}>{msg}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={styles.sectionLabel}>ASSISTANT IDENTITY</label>
                        <div className="glass-input" style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                            <div style={{ padding: '10px' }}>
                                <UserIcon color="#60a5fa" size={20} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                                placeholder="Enter Assistant Name..."
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                            <label style={styles.sectionLabel}>VISUAL INTERFACE</label>

                            <label style={styles.uploadLabel}>
                                {uploading ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
                                <span>{uploading ? 'Uploading...' : 'Upload Custom'}</span>
                                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                            </label>
                        </div>

                        {/* Preview Custom */}
                        {!AVATARS.some(a => a.url === selectedAvatar) && selectedAvatar && (
                            <div style={{ marginBottom: '16px', padding: '10px', border: '1px solid rgba(59,130,246,0.5)', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <img src={selectedAvatar} alt="Custom" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #60a5fa' }} />
                                <div>
                                    <p style={{ color: '#bfdbfe', fontWeight: '600', margin: 0 }}>Custom Image Selected</p>
                                    <p style={{ color: '#60a5fa', fontSize: '0.75rem', margin: 0 }}>Click Save to apply.</p>
                                </div>
                            </div>
                        )}

                        <div style={styles.avatarGrid}>
                            {AVATARS.map((avatar) => (
                                <motion.div
                                    key={avatar.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedAvatar(avatar.url)}
                                    style={styles.avatarOption(selectedAvatar === avatar.url)}
                                >
                                    <img src={avatar.url} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {selectedAvatar === avatar.url && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ background: '#2563eb', borderRadius: '50%', padding: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                                                <Check color="white" size={20} />
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: 'white', textAlign: 'center', fontSize: '0.75rem', padding: '4px', backdropFilter: 'blur(4px)' }}>
                                        {avatar.name}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploading}
                        style={styles.saveButton}
                        className="hover-brightness" // We can define a small utility/animation in CSS
                    >
                        <Save style={{ marginRight: '8px' }} size={20} />
                        {loading ? 'Initializing Update...' : 'Save Configuration'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Settings;
