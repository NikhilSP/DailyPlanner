import React from 'react';
import { Layout, Trophy } from 'lucide-react';

const ViewToggle = ({ viewMode, onToggle }) => {
    const isDaily = viewMode === 'daily';

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'row', // Horizontal
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-card)',
            alignItems: 'center',
            width: '100%', // Use full width of sidebar container
        },
        button: {
            flex: 1, // Equal width
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: 'var(--text-secondary)',
            background: 'transparent',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
        },
        active: {
            background: 'var(--status-warning)',
            color: '#F57F17',
            fontWeight: '600',
        }
    };

    return (
        <div style={styles.container}>
            <button
                style={{ ...styles.button, ...(isDaily ? styles.active : {}) }}
                onClick={() => onToggle('daily')}
            >
                <Layout size={16} />
                <span>Daily</span>
            </button>
            <button
                style={{ ...styles.button, ...(!isDaily ? styles.active : {}) }}
                onClick={() => onToggle('yearly')}
            >
                <Trophy size={16} />
                <span>Yearly</span>
            </button>
        </div>
    );
};

export default ViewToggle;
