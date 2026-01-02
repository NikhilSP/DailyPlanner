import React from 'react';
import { Archive, CheckCircle } from 'lucide-react';
import styles from './DailyTodos.module.css'; // Reusing styles for consistency, or I could make a new one

const ArchiveCenterView = ({ archive = [] }) => {

    // Group by date for better readability (optional enhancement)
    // For now simple list as per plan

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className={`bento-card ${styles.container}`}>
            <div className={styles.header}>
                <div className={styles.dateBadge} style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                    <Archive size={18} />
                    <span>Archive</span>
                </div>
                <div className={styles.dateText}>
                    Completed Tasks
                </div>
            </div>

            <div className={styles.taskList} style={{ overflowY: 'auto' }}>
                {archive.length === 0 ? (
                    <div className={styles.emptyFocus}>
                        <h3>No archives yet</h3>
                        <p>Tasks completed yesterday will appear here.</p>
                    </div>
                ) : (
                    archive.map((task) => (
                        <div key={task.id} className={styles.dailyTask} style={{ cursor: 'default' }}>
                            <div className={styles.checkboxWrapper}>
                                <CheckCircle size={20} color="#10b981" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <span className={`${styles.taskText} ${styles.completed}`}>
                                    {task.text}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                                    Completed: {formatDate(task.archivedAt)}
                                </span>
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
