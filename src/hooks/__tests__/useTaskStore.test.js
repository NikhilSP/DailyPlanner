import { renderHook, act } from '@testing-library/react';
import { useTaskStore } from '../useTaskStore';
import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '../../utils/migrations';
import { describe, it, expect } from 'vitest';

describe('useTaskStore', () => {
    it('initializes with default state when no storage exists', () => {
        const { result } = renderHook(() => useTaskStore());
        expect(result.current.daily).toBeDefined();
        expect(result.current.daily.length).toBeGreaterThan(0); // Assuming default has 1 task
    });

    it('adds a task', () => {
        const { result } = renderHook(() => useTaskStore());
        act(() => {
            result.current.addTask('New Task', 'daily');
        });
        expect(result.current.daily[0].text).toBe('New Task');
    });

    it('deletes a task', () => {
        const { result } = renderHook(() => useTaskStore());
        const taskId = result.current.daily[0].id;
        act(() => {
            result.current.deleteTask(taskId, 'daily');
        });
        expect(result.current.daily.find(t => t.id === taskId)).toBeUndefined();
    });

    it('toggles task completion', () => {
        const { result } = renderHook(() => useTaskStore());
        const taskId = result.current.daily[0].id;
        const initialStatus = result.current.daily[0].completed;

        act(() => {
            result.current.toggleComplete(taskId, 'daily');
        });

        expect(result.current.daily[0].completed).toBe(!initialStatus);
    });

    it('migrates legacy data correctly', () => {
        // Setup legacy data
        const legacyData = {
            milestones: [],
            daily: [{ id: 'l1', text: 'Legacy Task', completed: false }],
            hopper: []
        };
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legacyData));

        const { result } = renderHook(() => useTaskStore());

        // Should have loaded legacy data
        expect(result.current.daily[0].text).toBe('Legacy Task');

        // Should have saved to new key with version
        const newData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        expect(newData).toBeDefined();
        expect(newData.version).toBe(1);
    });

    it('archives completed tasks on a new day', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const oldData = {
            version: 1,
            daily: [
                { id: '1', text: 'Done Task', completed: true },
                { id: '2', text: 'Pending Task', completed: false }
            ],
            archive: [],
            lastActiveDate: yesterdayStr
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(oldData));

        const { result } = renderHook(() => useTaskStore());

        // Check archive
        expect(result.current.archive.length).toBe(1);
        expect(result.current.archive[0].text).toBe('Done Task');
        expect(result.current.archive[0].archivedAt).toBe(yesterdayStr);

        // Check daily (only pending remains)
        expect(result.current.daily.length).toBe(1);
        expect(result.current.daily[0].text).toBe('Pending Task');
    });
});
