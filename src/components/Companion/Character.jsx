import React from 'react';
import styles from './Character.module.css';

// Simple Emoji-based character for MVP, wrapped in a cute container
// We can upgrade to custom SVGs later if needed to be "cuter"
const STATES = {
    SEARCHING: { emoji: '🧐', text: 'Hmm...' },
    IDLE: { emoji: '☕', text: 'Ready?' },
    WORKING: { emoji: '🤓', text: 'Focus!' },
    CELEBRATING: { emoji: '🎉', text: 'Yay!' },
    SLEEPING: { emoji: '😴', text: 'Zzz...' },
};

const Character = ({ state = 'IDLE', message }) => {
    const current = STATES[state] || STATES.IDLE;

    return (
        <div className={styles.container}>
            {message && (
                <div className={styles.bubble}>
                    {message}
                </div>
            )}
            <div className={`${styles.avatar} ${styles[state.toLowerCase()]}`}>
                <span className={styles.emoji}>{current.emoji}</span>
            </div>
        </div>
    );
};

export default Character;
