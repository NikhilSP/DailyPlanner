export const CURRENT_VERSION = 1;
export const STORAGE_KEY = 'digital-sanctuary-data';
export const LEGACY_STORAGE_KEY = 'digital-sanctuary-v2';

export const INITIAL_STATE = {
    version: CURRENT_VERSION,
    milestones: [],
    hopper: [],
    daily: [],
    archive: [],
    lastActiveDate: new Date().toISOString().split('T')[0],
};

// Migration functions
// const migrations = {
// Example: 0: (data) => { ...return newData }
// ...
// };

export const migrateData = (data) => {
    // 1. If no data, return default
    if (!data) return INITIAL_STATE;

    let currentData = { ...data };
    let currentVersion = currentData.version || 0;

    // If it comes from the legacy key, it might not have a version, so treat as v0
    if (currentVersion === 0 && !currentData.version) {
        // "Migration" from v0 (legacy) to v1
        // Ensure all required fields exist
        currentData = {
            ...INITIAL_STATE,
            ...currentData,
            version: 1
        };
        currentVersion = 1;
    }

    // Future migrations would go here:
    // while (currentVersion < CURRENT_VERSION) {
    //    const migrationFn = migrations[currentVersion];
    //    if (migrationFn) {
    //        currentData = migrationFn(currentData);
    //        currentData.version = currentVersion + 1;
    //        currentVersion++;
    //    } else {
    //        break; // Should not happen if configured correctly
    //    }
    // }

    return currentData;
};
