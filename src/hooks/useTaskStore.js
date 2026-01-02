import { useState, useEffect } from 'react';
// Removed uuid import to keep it lightweight

// Helper for simple ID generation if uuid not available
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to get today's date string (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE = {
    milestones: [
        {
            id: 'm1',
            text: 'Launch Digital Sanctuary',
            completed: false,
            checkpoints: [
                { id: 'c1', text: 'Design Interface', completed: true },
                { id: 'c2', text: 'Implement Drag & Drop', completed: true },
                { id: 'c3', text: 'Add Checkpoint System', completed: false }
            ]
        },
    ],
    hopper: [
        { id: 'h1', text: 'Clean the garage' },
        { id: 'h2', text: 'Call Mom' },
    ],
    daily: [
        { id: 'd1', text: 'Finish App Logic', completed: false },
    ],
    archive: [],
    lastActiveDate: getTodayString(),
};

export const useTaskStore = () => {
    const [state, setState] = useState(() => {
        try {
            const localData = localStorage.getItem('digital-sanctuary-v2');
            let parsedData = localData ? JSON.parse(localData) : INITIAL_STATE;

            // Ensure archive array exists (migration for existing users)
            if (!parsedData.archive) parsedData.archive = [];

            // Check for new day reset
            const today = getTodayString();
            const lastDate = parsedData.lastActiveDate || today;

            if (lastDate !== today) {
                // It's a new day!
                // 1. Identify completed daily tasks (keep uncompleted ones)
                const completedDaily = parsedData.daily.filter(t => t.completed);
                const remainingDaily = parsedData.daily.filter(t => !t.completed);

                // 2. Archive them with timestamp
                const newArchived = completedDaily.map(t => ({
                    ...t,
                    archivedAt: lastDate // Store the date they were "completed" (or rather, the last active day)
                }));

                // 3. Update state to reflect changes
                parsedData = {
                    ...parsedData,
                    daily: remainingDaily,
                    archive: [...newArchived, ...parsedData.archive], // Add new to top
                    lastActiveDate: today
                };
            }

            return parsedData;

        } catch (e) {
            console.error("Failed to load data", e);
            return INITIAL_STATE;
        }
    });

    useEffect(() => {
        // Update lastActiveDate whenever we save, to keep it current during the day
        const stateToSave = {
            ...state,
            lastActiveDate: getTodayString()
        };
        localStorage.setItem('digital-sanctuary-v2', JSON.stringify(stateToSave));
    }, [state]);

    const addTask = (text, list = 'daily') => {
        const newTask = { id: generateId(), text, completed: false, createdAt: Date.now() };
        setState(prev => ({
            ...prev,
            [list]: [newTask, ...prev[list]] // Add to top
        }));
    };

    const toggleComplete = (id, list) => {
        setState(prev => ({
            ...prev,
            [list]: prev[list].map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
    };

    const deleteTask = (id, list) => {
        setState(prev => ({
            ...prev,
            [list]: prev[list].filter(t => t.id !== id)
        }));
    };

    const moveTask = (sourceList, destList, sourceIndex, destIndex) => {
        const sourceClone = Array.from(state[sourceList]);
        const destClone = Array.from(state[destList]);
        const [removed] = sourceClone.splice(sourceIndex, 1);

        if (sourceList === destList) {
            sourceClone.splice(destIndex, 0, removed);
            setState(prev => ({ ...prev, [sourceList]: sourceClone }));
        } else {
            destClone.splice(destIndex, 0, removed);
            setState(prev => ({
                ...prev,
                [sourceList]: sourceClone,
                [destList]: destClone
            }));
        }
    };

    // Milestone Checkpoint Actions
    const addCheckpoint = (milestoneId, text) => {
        const newCheckpoint = { id: generateId(), text, completed: false };
        setState(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === milestoneId
                    ? { ...m, checkpoints: [...(m.checkpoints || []), newCheckpoint] }
                    : m
            )
        }));
    };

    const toggleCheckpoint = (milestoneId, checkpointId) => {
        setState(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === milestoneId
                    ? {
                        ...m,
                        checkpoints: m.checkpoints.map(c =>
                            c.id === checkpointId ? { ...c, completed: !c.completed } : c
                        )
                    }
                    : m
            )
        }));
    };

    const deleteCheckpoint = (milestoneId, checkpointId) => {
        setState(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === milestoneId
                    ? {
                        ...m,
                        checkpoints: m.checkpoints.filter(c => c.id !== checkpointId)
                    }
                    : m
            )
        }));
    };

    const addMilestone = (title) => {
        const newMilestone = {
            id: generateId(),
            text: title || 'New Milestone',
            completed: false,
            checkpoints: []
        };
        setState(prev => ({
            ...prev,
            milestones: [...prev.milestones, newMilestone]
        }));
    };

    const updateMilestoneTitle = (id, newTitle) => {
        setState(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === id ? { ...m, text: newTitle } : m
            )
        }));
    };

    const deleteMilestone = (id) => {
        setState(prev => ({
            ...prev,
            milestones: prev.milestones.filter(m => m.id !== id)
        }));
    };

    // Character Logic Helpers
    const getCharacterState = () => {
        // 1. Check for recent completions (we'd need to track event timestamp, simplified for now)
        // 2. Check time of day
        // 3. Check workload
        const hour = new Date().getHours();
        const dailyCount = state.daily.length;
        const completedCount = state.daily.filter(t => t.completed).length;

        if (hour >= 23 || hour < 5) return { state: 'SLEEPING', message: 'Rest up for tomorrow.' };
        if (dailyCount === 0) return { state: 'IDLE', message: 'What is our focus today?' };
        if (completedCount > 0 && completedCount === dailyCount) return { state: 'CELEBRATING', message: 'All done! Amazing!' };
        if (completedCount > 0) return { state: 'WORKING', message: 'Good progress. Keep it up!' };
        return { state: 'WORKING', message: 'Let\'s crush this list.' };
    };

    return {
        milestones: state.milestones,
        hopper: state.hopper,
        daily: state.daily,
        archive: state.archive,
        addTask,
        toggleComplete,
        deleteTask,
        moveTask,
        addCheckpoint,
        toggleCheckpoint,
        deleteCheckpoint,
        addMilestone,
        updateMilestoneTitle,
        deleteMilestone,
        character: getCharacterState()
    };
};
