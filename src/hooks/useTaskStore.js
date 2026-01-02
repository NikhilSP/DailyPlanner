import { useState, useEffect, useCallback, useMemo } from 'react';
import { migrateData, STORAGE_KEY, LEGACY_STORAGE_KEY, INITIAL_STATE as DEFAULT_STATE } from '../utils/migrations';

// Helper for simple ID generation if uuid not available
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to get today's date string (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE = {
    ...DEFAULT_STATE,
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
        { id: 'd1', text: 'Finish App Logic', completed: false, label: 'work' },
    ],
};

export const useTaskStore = () => {
    const [state, setState] = useState(() => {
        try {
            // 1. Try new key first
            let localData = localStorage.getItem(STORAGE_KEY);
            let parsedData;

            if (localData) {
                parsedData = JSON.parse(localData);
            } else {
                // 2. Fallback to legacy key
                const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
                if (legacyData) {
                    parsedData = JSON.parse(legacyData);
                    // We found legacy data, we will migrate it and save to new key later
                } else {
                    return INITIAL_STATE;
                }
            }

            // 3. Run Migrations
            parsedData = migrateData(parsedData);

            // 4. Daily Reset Logic
            // Ensure archive array exists
            if (!parsedData.archive) parsedData.archive = [];

            // Check for new day reset
            const today = getTodayString();
            const lastDate = parsedData.lastActiveDate || today;

            if (lastDate !== today) {
                // It's a new day!
                const completedDaily = (parsedData.daily || []).filter(t => t.completed);
                const remainingDaily = (parsedData.daily || []).filter(t => !t.completed);

                const newArchived = completedDaily.map(t => ({
                    ...t,
                    archivedAt: lastDate
                }));

                parsedData = {
                    ...parsedData,
                    daily: remainingDaily,
                    archive: [...newArchived, ...(parsedData.archive || [])],
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
        // Save to NEW key
        const stateToSave = {
            ...state,
            lastActiveDate: getTodayString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [state]);

    const addTask = useCallback((text, list = 'daily', label = 'work') => {
        const newTask = { id: generateId(), text, completed: false, label, createdAt: Date.now() };
        setState(prev => ({
            ...prev,
            [list]: [newTask, ...prev[list]] // Add to top
        }));
    }, []);

    const toggleComplete = useCallback((id, list) => {
        setState(prev => ({
            ...prev,
            [list]: prev[list].map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
    }, []);

    const deleteTask = useCallback((id, list) => {
        setState(prev => ({
            ...prev,
            [list]: prev[list].filter(t => t.id !== id)
        }));
    }, []);

    const moveTask = useCallback((sourceList, destList, sourceIndex, destIndex) => {
        // We need 'state' for reading, but since we are inside a setState callback we can do it functionally.
        // Wait, moveTask logic relied on `state[sourceList]`. We cannot easily access `state` inside `useCallback` without adding it to dependency,
        // which defeats the purpose if state changes often.
        // However, we can use the functional update form of setState to access latest state.

        setState(prev => {
            const sourceClone = Array.from(prev[sourceList]);
            const destClone = Array.from(prev[destList]);
            const [removed] = sourceClone.splice(sourceIndex, 1);

            if (sourceList === destList) {
                sourceClone.splice(destIndex, 0, removed);
                return { ...prev, [sourceList]: sourceClone };
            } else {
                destClone.splice(destIndex, 0, removed);
                return {
                    ...prev,
                    [sourceList]: sourceClone,
                    [destList]: destClone
                };
            }
        });
    }, []);

    // Milestone Checkpoint Actions
    const addCheckpoint = useCallback((milestoneId, text) => {
        const newCheckpoint = { id: generateId(), text, completed: false };
        setState(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === milestoneId
                    ? { ...m, checkpoints: [...(m.checkpoints || []), newCheckpoint] }
                    : m
            )
        }));
    }, []);

    const toggleCheckpoint = useCallback((milestoneId, checkpointId) => {
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
    }, []);

    const deleteCheckpoint = useCallback((milestoneId, checkpointId) => {
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
    }, []);

    const addMilestone = useCallback((title) => {
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
    }, []);

    const updateMilestoneTitle = useCallback((id, newTitle) => {
        setState(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === id ? { ...m, text: newTitle } : m
            )
        }));
    }, []);

    const deleteMilestone = useCallback((id) => {
        setState(prev => ({
            ...prev,
            milestones: prev.milestones.filter(m => m.id !== id)
        }));
    }, []);

    // Character Logic
    const character = useMemo(() => {
        const hour = new Date().getHours();
        const dailyCount = state.daily.length;
        const completedCount = state.daily.filter(t => t.completed).length;

        if (hour >= 23 || hour < 5) return { state: 'SLEEPING', message: 'Rest up for tomorrow.' };
        if (dailyCount === 0) return { state: 'IDLE', message: 'What is our focus today?' };
        if (completedCount > 0 && completedCount === dailyCount) return { state: 'CELEBRATING', message: 'All done! Amazing!' };
        if (completedCount > 0) return { state: 'WORKING', message: 'Good progress. Keep it up!' };
        return { state: 'WORKING', message: 'Let\'s crush this list.' };
    }, [state.daily]);

    return useMemo(() => ({
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
        character
    }), [
        state.milestones,
        state.hopper,
        state.daily,
        state.archive,
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
        character
    ]);
};
