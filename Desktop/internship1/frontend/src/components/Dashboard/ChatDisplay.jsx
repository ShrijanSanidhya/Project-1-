import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const ChatDisplay = ({ messages }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const styles = {
        container: {
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        emptyState: {
            textAlign: 'center',
            color: '#9ca3af',
            marginTop: '80px'
        },
        messageRow: (isUser) => ({
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '16px'
        }),
        messageContainer: (isUser) => ({
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: isUser ? 'row-reverse' : 'row',
            maxWidth: '80%'
        }),
        avatar: (isUser) => ({
            padding: '8px',
            borderRadius: '50%',
            marginTop: '4px',
            background: isUser ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: isUser ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
            marginLeft: isUser ? '12px' : '0',
            marginRight: isUser ? '0' : '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }),
        bubble: (isUser) => ({
            padding: '16px',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            color: isUser ? 'white' : '#e5e7eb',
            background: isUser ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: isUser ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderTopRightRadius: isUser ? '0' : '16px',
            borderTopLeftRadius: isUser ? '16px' : '0'
        })
    };

    return (
        <div style={styles.container} className="custom-scrollbar">
            {messages.length === 0 && (
                <div style={styles.emptyState}>
                    <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Ready to assist.</p>
                    <p style={{ fontSize: '0.875rem' }}>Tap the microphone to start.</p>
                </div>
            )}

            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.messageRow(msg.role === 'user')}
                >
                    <div style={styles.messageContainer(msg.role === 'user')}>
                        <div style={styles.avatar(msg.role === 'user')}>
                            {msg.role === 'user' ? <User size={20} color="#60a5fa" /> : <Bot size={20} color="#22d3ee" />}
                        </div>

                        <div style={styles.bubble(msg.role === 'user')}>
                            {msg.text}
                        </div>
                    </div>
                </motion.div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatDisplay;
