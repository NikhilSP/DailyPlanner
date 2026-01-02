import React, { useState } from 'react';
import { Sun, Trash2 } from 'lucide-react';
import styles from './DailyTodos.module.css';

const DailyTodos = ({ tasks = [], onAdd, onToggle, onDelete, Draggable }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className={`bento-card ${styles.container}`}>
            <div className={styles.header}>
                <div className={styles.dateBadge}>
                    <Sun size={18} className={styles.sunIcon} />
                    <span>Today</span>
                </div>
                <div className={styles.dateText}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className={styles.taskList}>
                {tasks.length === 0 ? (
                    <div className={styles.emptyFocus}>
                        <h3>Ready to focus?</h3>
                        <p>Drag tasks here or type below.</p>
                    </div>
                ) : (
                    tasks.map((task, index) => (
                        Draggable ? (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
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
                                        <span className={`${styles.taskText} ${task.completed ? styles.completed : ''}`}>
                                            {task.text}
                                        </span>
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

            <form onSubmit={handleSubmit} className={styles.inputArea}>
                <input
                    type="text"
                    placeholder="What is the main thing today?"
                    className={styles.mainInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </form>
        </div>
    );
};

export default DailyTodos;
