import React from 'react';
import { Archive, CheckCircle } from 'lucide-react';
import styles from './DailyTodos.module.css'; // Reusing styles for consistency, or I could make a new one

const ArchiveCenterView = ({ archive = [] }) => {
    const [sortBy, setSortBy] = React.useState('default'); // 'default' | 'label'

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const sortedArchive = [...archive].sort((a, b) => {
        if (sortBy === 'default') return 0;
        if (sortBy === 'label') {
            if (a.label === b.label) return 0;
            return a.label === 'work' ? -1 : 1;
        }
        return 0;
    });

    const getLabelColor = (label) => {
        return label === 'work' ? '#e0f2fe' : '#fce7f3';
    };

    const getLabelTextColor = (label) => {
        return label === 'work' ? '#0369a1' : '#be185d';
    };

    return (
        <div className={`bento-card ${styles.container}`}>
            <div className={styles.header}>
                <div className={styles.dateBadge} style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                    <Archive size={18} />
                    <span>Archive</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={() => setSortBy(prev => prev === 'default' ? 'label' : 'default')}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            color: sortBy === 'label' ? '#4f46e5' : '#9ca3af',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        {sortBy === 'label' ? 'Sorted by Label' : 'Sort by Label'}
                    </button>
                    <div className={styles.dateText}>
                        Completed Tasks
                    </div>
                </div>
            </div>

            <div className={styles.taskList} style={{ overflowY: 'auto' }}>
                {archive.length === 0 ? (
                    <div className={styles.emptyFocus}>
                        <h3>No archives yet</h3>
                        <p>Tasks completed yesterday will appear here.</p>
                    </div>
                ) : (
                    sortedArchive.map((task) => (
                        <div key={task.id} className={styles.dailyTask} style={{ cursor: 'default' }}>
                            <div className={styles.checkboxWrapper}>
                                <CheckCircle size={20} color="#10b981" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '4px' }}>
                                <span className={`${styles.taskText} ${styles.completed}`}>
                                    {task.text}
                                </span>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {task.label && (
                                        <span style={{
                                            fontSize: '0.65rem',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            backgroundColor: getLabelColor(task.label),
                                            color: getLabelTextColor(task.label),
                                            textTransform: 'capitalize'
                                        }}>
                                            {task.label}
                                        </span>
                                    )}
                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                        Completed: {formatDate(task.archivedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* No input area for archive */}
        </div>
    );
};


export default ArchiveCenterView;
