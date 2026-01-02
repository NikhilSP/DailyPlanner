import React from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import styles from './YearlyMilestones.module.css';

const YearlyMilestones = ({ milestones = [] }) => {
    // Calculate progress
    const completed = milestones.reduce((acc, m) => acc + (m.checkpoints?.filter(c => c.completed).length || 0), 0);
    const total = milestones.reduce((acc, m) => acc + (m.checkpoints?.length || 0), 0);
    // Avoid division by zero
    const progress = total === 0 ? 0 : (completed / total) * 100;

    return (
        <div className={`bento-card ${styles.container}`}>
            <div className={styles.summary}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconBox}><Trophy size={16} /></div>
                    <span className={styles.title}>2025 Milestones</span>
                </div>

                <div className={styles.progressBarContainer}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div style={{ marginLeft: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {Math.round(progress)}%
                </div>
            </div>
        </div>
    );
};

export default YearlyMilestones;
