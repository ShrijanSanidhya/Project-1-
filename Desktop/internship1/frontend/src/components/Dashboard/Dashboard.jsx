import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import VoiceInput from './VoiceInput';
import ChatDisplay from './ChatDisplay';
import api from '../../utils/api';
import { speak } from '../../utils/speechSynthesis';
import { Link } from 'react-router-dom';
import { LogOut, Settings, Menu, X } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleVoiceInput = async (transcript) => {
        if (!transcript) return;

        // Add user message
        const userMsg = { role: 'user', text: transcript };
        setMessages(prev => [...prev, userMsg]);
        setProcessing(true);

        try {
            const res = await api.post('/assistant/chat', { message: transcript });
            const aiText = res.data.reply;

            const aiMsg = { role: 'assistant', text: aiText };
            setMessages(prev => [...prev, aiMsg]);
            speak(aiText);

        } catch (err) {
            console.error('Error getting AI response:', err);
            const errorMsg = { role: 'assistant', text: "Connection error. Please try again." };
            setMessages(prev => [...prev, errorMsg]);
            speak("I'm having trouble connecting.");
        } finally {
            setProcessing(false);
        }
    };

    // Inline Styles
    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative'
        },
        sidebar: {
            width: '280px',
            display: isSidebarOpen ? 'flex' : 'none', // Simple toggle for now, handled by media queries usually but inline is tricky for responsive. We will use conditional render logic.
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            background: 'rgba(0,0,0,0.3)', // Darker glass
            zIndex: 50
        },
        sidebarDesktop: {
            // Logic to show on desktop is usually needing CSS media queries. 
            // With inline styles, we rely on standard behavior or window width.
            // For robustness, I'll add a style tag for media queries in return render or stick to standard CSS for *layout structure* in index.css
            // But user asked for inline. I'll make the sidebar permanent here and rely on the mobile overlay for mobile.
            display: 'flex',
            width: '260px',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(23, 23, 23, 0.4)', // Semi-transparent
            backdropFilter: 'blur(10px)'
        },
        mobileHeader: {
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        },
        mainContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: 'transparent'
        },
        avatar: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6',
            fontWeight: 'bold',
            fontSize: '1.2rem'
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '30px'
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px',
            color: '#9ca3af',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'color 0.2s',
            marginBottom: '8px',
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            width: '100%',
            fontSize: '1rem'
        },
        voiceContainer: {
            padding: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        processingText: {
            color: '#60a5fa',
            marginBottom: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            animation: 'pulse 1.5s infinite' // Defined in index.css usually or standard CSS
        }
    };

    return (
        <div style={styles.container}>
            {/* Desktop Sidebar (Hidden on Mobile via CSS usually, doing logic here) */}
            {/* We will rely on window.innerWidth checking or simple CSS class for hiding. 
                Since user asked for INLINE, I will use a simple style block for responsive visibility */}
            <style>
                {`
                    @media (max-width: 768px) {
                        .desktop-sidebar { display: none !important; }
                        .mobile-header { display: flex !important; }
                    }
                    @media (min-width: 769px) {
                        .desktop-sidebar { display: flex !important; }
                        .mobile-header { display: none !important; }
                    }
                `}
            </style>

            <div className="desktop-sidebar glass" style={styles.sidebarDesktop}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '2rem', letterSpacing: '0.05em' }} className="neon-text">JARVIS</h1>

                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                            {user?.assistantImage ? (
                                <img src={user.assistantImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user?.assistantName?.charAt(0) || 'J'
                            )}
                        </div>
                        <div>
                            <p style={{ fontWeight: '600', color: '#e5e7eb', margin: 0 }}>{user?.assistantName || 'Assistant'}</p>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: '#60a5fa', marginTop: '4px' }}>
                                <span style={{ width: '8px', height: '8px', background: '#60a5fa', borderRadius: '50%', marginRight: '6px', boxShadow: '0 0 5px #60a5fa' }}></span>
                                Online
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Link to="/settings" style={styles.navItem} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>
                        <Settings size={20} /> Settings
                    </Link>
                    <button onClick={logout} style={{ ...styles.navItem, color: '#f87171' }} onMouseOver={e => e.currentTarget.style.color = '#fca5a5'} onMouseOut={e => e.currentTarget.style.color = '#f87171'}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }} className="neon-text">JARVIS</h1>
                        <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'white' }}><X size={28} /></button>
                    </div>
                    {/* Reusing desktop layout logic for mobile content */}
                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                            {user?.assistantImage ? (
                                <img src={user.assistantImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user?.assistantName?.charAt(0) || 'J'
                            )}
                        </div>
                        <div>
                            <p style={{ fontWeight: '600', color: '#e5e7eb', margin: 0 }}>{user?.assistantName || 'Assistant'}</p>
                            <p style={{ fontSize: '0.75rem', color: '#60a5fa', margin: 0 }}>Online</p>
                        </div>
                    </div>
                    <Link to="/settings" onClick={() => setIsSidebarOpen(false)} style={{ ...styles.navItem, fontSize: '1.25rem', marginBottom: '20px' }}>
                        <Settings size={24} /> Settings
                    </Link>
                    <button onClick={logout} style={{ ...styles.navItem, color: '#f87171', fontSize: '1.25rem' }}>
                        <LogOut size={24} /> Logout
                    </button>
                </div>
            )}

            <div style={styles.mainContent}>
                {/* Mobile Header */}
                <div className="mobile-header" style={styles.mobileHeader}>
                    <span className="neon-text" style={{ fontWeight: 'bold', color: '#60a5fa', fontSize: '1.2rem' }}>JARVIS</span>
                    <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'white' }}><Menu size={24} /></button>
                </div>

                <ChatDisplay messages={messages} />

                <div className="glass" style={styles.voiceContainer}>
                    {processing && <p style={styles.processingText}>PROCESSING...</p>}
                    <VoiceInput onVoiceInput={handleVoiceInput} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
