import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import styles from './MilestoneOverlay.module.css';

const MilestoneOverlay = ({ milestone, onClose, onUpdateTitle, onAddCheckpoint, onToggleCheckpoint, onDeleteCheckpoint }) => {
    if (!milestone) return null;

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <input
                        className={styles.titleInput}
                        value={milestone.text}
                        onChange={(e) => onUpdateTitle(milestone.id, e.target.value)}
                        placeholder="Milestone Title"
                    />
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.sectionTitle}>Checkpoints</div>

                    {(!milestone.checkpoints || milestone.checkpoints.length === 0) && (
                        <p style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>
                            No checkpoints yet. Add one below.
                        </p>
                    )}

                    <ul className={styles.checkpointsList}>
                        {(milestone.checkpoints || []).map(checkpoint => (
                            <li key={checkpoint.id} className={styles.checkpointItem}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={checkpoint.completed}
                                    onChange={() => onToggleCheckpoint(milestone.id, checkpoint.id)}
                                />
                                <span className={`${styles.checkpointText} ${checkpoint.completed ? styles.completedText : ''}`}>
                                    {checkpoint.text}
                                </span>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => onDeleteCheckpoint(milestone.id, checkpoint.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.footer}>
                    <CheckpointInput onAdd={(text) => onAddCheckpoint(milestone.id, text)} />
                </div>
            </div>
        </div>
    );
};

const CheckpointInput = ({ onAdd }) => {
    const [text, setText] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && text.trim()) {
            onAdd(text.trim());
            setText('');
        }
    };

    return (
        <input
            className={styles.addInput}
            placeholder="+ Add a new checkpoint (Press Enter)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
};

export default MilestoneOverlay;
