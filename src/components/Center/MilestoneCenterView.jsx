import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from './MilestoneCenterView.module.css';

const MilestoneCenterView = ({ milestones, onSelectMilestone, onAddMilestone, onDeleteMilestone, onToggleCheckpoint }) => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Yearly Milestones</div>

            <div className={styles.gridContainer}>
                {milestones.map(milestone => {
                    const total = milestone.checkpoints?.length || 0;
                    const completed = milestone.checkpoints?.filter(c => c.completed).length || 0;
                    const progress = total === 0 ? 0 : (completed / total) * 100;

                    return (
                        <div
                            key={milestone.id}
                            className={styles.milestoneCard}
                            onClick={() => onSelectMilestone(milestone.id)}
                        >
                            <div className={styles.header}>
                                <span className={styles.milestoneTitle}>{milestone.text}</span>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Confirm deletion
                                        if (window.confirm('Delete this milestone?')) {
                                            onDeleteMilestone(milestone.id);
                                        }
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className={styles.progressContainer}>
                                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                            </div>

                            <div className={styles.stats}>
                                <span>{completed}/{total} Checkpoints</span>
                                <span>{Math.round(progress)}%</span>
                            </div>

                            {/* Checkpoints List */}
                            <div className={styles.checklist}>
                                {(milestone.checkpoints || []).map(checkpoint => (
                                    <div
                                        key={checkpoint.id}
                                        className={styles.checkItem}
                                        onClick={(e) => e.stopPropagation()} // Prevent card click
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checkpoint.completed}
                                            onChange={() => onToggleCheckpoint(milestone.id, checkpoint.id)}
                                            className={styles.checkbox}
                                        />
                                        <span className={checkpoint.completed ? styles.completedText : ''}>{checkpoint.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <div
                    className={`${styles.milestoneCard} ${styles.addCard} `}
                    onClick={() => onAddMilestone()}
                >
                    <Plus size={32} className={styles.addIcon} />
                    <span>Add Milestone</span>
                </div>
            </div>
        </div>
    );
};

export default MilestoneCenterView;
