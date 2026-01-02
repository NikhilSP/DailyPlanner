import React, { useState } from 'react';
import { Sun, Trash2 } from 'lucide-react';
import styles from './DailyTodos.module.css';

const DailyTodos = ({ tasks = [], onAdd, onToggle, onDelete, Draggable }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('work'); // 'work' | 'life'
    const [sortBy, setSortBy] = useState('default'); // 'default' | 'label'

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue, selectedLabel);
            setInputValue('');
        }
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortBy === 'default') return 0; // Maintain order
        if (sortBy === 'label') {
            // Sort by label (Work first, then Life - or grouped)
            if (a.label === b.label) return 0;
            return a.label === 'work' ? -1 : 1;
        }
        return 0;
    });

    const getLabelColor = (label) => {
        return label === 'work' ? '#e0f2fe' : '#fce7f3'; // Light blue vs light pink
    };

    const getLabelTextColor = (label) => {
        return label === 'work' ? '#0369a1' : '#be185d';
    };

    return (
        <div className={`bento-card ${styles.container}`}>
            <div className={styles.header}>
                <div className={styles.dateBadge}>
                    <Sun size={18} className={styles.sunIcon} />
                    <span>Today</span>
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
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            <div className={styles.taskList}>
                {tasks.length === 0 ? (
                    <div className={styles.emptyFocus}>
                        <h3>Ready to focus?</h3>
                        <p>Drag tasks here or type below.</p>
                    </div>
                ) : (
                    sortedTasks.map((task, index) => (
                        Draggable ? (
                            <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={sortBy === 'label'}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={styles.dailyTask}
                                        style={{ ...provided.draggableProps.style }}
                                    >
                                        <div className={styles.checkboxWrapper}>
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                className={styles.checkbox}
                                                onChange={() => onToggle(task.id)}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '4px' }}>
                                            <span className={`${styles.taskText} ${task.completed ? styles.completed : ''}`}>
                                                {task.text}
                                            </span>
                                            {task.label && (
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: getLabelColor(task.label),
                                                    color: getLabelTextColor(task.label),
                                                    width: 'fit-content',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {task.label}
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => onDelete(task.id)} className={styles.deleteBtn}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </Draggable>
                        ) : null
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className={styles.inputArea} style={{ flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
                <input
                    type="text"
                    placeholder="What is the main thing today?"
                    className={styles.mainInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={() => setSelectedLabel('work')}
                        style={{
                            flex: 1,
                            padding: '6px',
                            border: selectedLabel === 'work' ? '2px solid #0ea5e9' : '1px solid #e5e7eb',
                            borderRadius: '6px',
                            backgroundColor: selectedLabel === 'work' ? '#f0f9ff' : 'white',
                            color: selectedLabel === 'work' ? '#0ea5e9' : '#6b7280',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Work
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedLabel('life')}
                        style={{
                            flex: 1,
                            padding: '6px',
                            border: selectedLabel === 'life' ? '2px solid #ec4899' : '1px solid #e5e7eb',
                            borderRadius: '6px',
                            backgroundColor: selectedLabel === 'life' ? '#fdf2f8' : 'white',
                            color: selectedLabel === 'life' ? '#ec4899' : '#6b7280',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Life
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DailyTodos;
