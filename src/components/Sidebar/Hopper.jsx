import React from 'react';
import { Calendar, Archive } from 'lucide-react';
import styles from './Hopper.module.css';

const Hopper = ({ tasks = [], Draggable, onViewArchive, isArchiveActive }) => {
    return (
        <div className={`bento-card ${styles.container}`}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} className={styles.icon} />
                    <h2 className={styles.title}>The Hopper</h2>
                </div>
                <button
                    onClick={onViewArchive}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        color: isArchiveActive ? '#4f46e5' : '#9ca3af',
                        backgroundColor: isArchiveActive ? '#e0e7ff' : 'transparent',
                        transition: 'all 0.2s'
                    }}
                    title="View Archive"
                >
                    <Archive size={18} />
                </button>
            </div>
            <p className={styles.subtitle}>Drag to Today to start.</p>

            <div className={styles.taskList}>
                {tasks.length === 0 ? (
                    <div className={styles.emptyState}>No usage pending</div>
                ) : (
                    tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={styles.taskCard}
                                    style={{
                                        ...provided.draggableProps.style,
                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                    }}
                                >
                                    {task.text}
                                </div>
                            )}
                        </Draggable>
                    ))
                )}
            </div>
        </div>
    );
};

export default Hopper;
