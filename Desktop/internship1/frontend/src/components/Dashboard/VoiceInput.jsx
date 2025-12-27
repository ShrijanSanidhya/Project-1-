import React, { useEffect } from 'react';
import useVoiceInput from '../../hooks/useVoiceInput';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceInput = ({ onVoiceInput }) => {
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();

    useEffect(() => {
        if (transcript) {
            onVoiceInput(transcript);
            resetTranscript();
        }
    }, [transcript, onVoiceInput, resetTranscript]);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '16px'
        },
        button: (listening) => ({
            position: 'relative',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            backdropFilter: 'blur(4px)',
            background: listening ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.3)',
            boxShadow: listening ? '0 0 50px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(59, 130, 246, 0.5)' : '0 0 20px rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible'
        }),
        ring: (delay) => ({
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '120%',
            height: '120%',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTop: '2px solid #3b82f6',
            borderBottom: '2px solid #3b82f6',
            animation: `spin ${isListening ? 2 : 10}s linear infinite`,
            animationDelay: delay,
            opacity: isListening ? 1 : 0.3
        })
    };

    return (
        <div style={styles.container}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isListening ? stopListening : startListening}
                style={styles.button(isListening)}
            >
                {/* Reactor Rings */}
                <div style={styles.ring('0s')} className="reactor-ring" />
                <div style={{ ...styles.ring('0s'), width: '140%', height: '140%', top: '-20%', left: '-20%', animationDirection: 'reverse', animationDuration: isListening ? '3s' : '15s' }} />

                {isListening ? <MicOff size={32} color="#60a5fa" style={{ zIndex: 2 }} /> : <Mic size={32} color="#60a5fa" style={{ zIndex: 2 }} />}
            </motion.button>

            {isListening && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.text}
                >
                    Listening...
                </motion.div>
            )}
        </div>
    );
};

export default VoiceInput;
