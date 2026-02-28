// src/services/GameProgressService.js
const API_BASE = 'http://localhost:5000/api';

export const GameProgressService = {
    // Get progress for a level
    async getProgress(userId, levelId) {
        try {
            console.log(`📊 Fetching progress for user ${userId}, level ${levelId}`);
            const res = await fetch(`${API_BASE}/progress/${userId}/${levelId}`);
            if (!res.ok) throw new Error('Failed to fetch progress');
            const data = await res.json();
            console.log('✅ Progress loaded:', data);
            return data;
        } catch (error) {
            console.error('Error fetching progress:', error);
            return null;
        }
    },

    // Add discovery with validation
    async addDiscovery(userId, levelId, evidenceText) {
        try {
            console.log('🔍 Validating evidence...');
            const res = await fetch(`${API_BASE}/progress/add-discovery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, levelId, evidenceText })
            });
            const data = await res.json();
            console.log('✅ Discovery result:', data);
            return data;
        } catch (error) {
            console.error('Error adding discovery:', error);
            return { message: 'Connection error', error: true };
        }
    },

    // Add note
    async addNote(userId, levelId, note) {
        try {
            const res = await fetch(`${API_BASE}/progress/add-note`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, levelId, note })
            });
            return await res.json();
        } catch (error) {
            console.error('Error adding note:', error);
            return { message: 'Connection error', error: true };
        }
    },

    // Submit case
    async submitCase(userId, levelId, conclusion) {
        try {
            const res = await fetch(`${API_BASE}/progress/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, levelId, conclusion })
            });
            return await res.json();
        } catch (error) {
            console.error('Error submitting case:', error);
            return { message: 'Connection error', error: true };
        }
    },

    // Reset level
    async resetLevel(userId, levelId) {
        try {
            const res = await fetch(`${API_BASE}/progress/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, levelId })
            });
            return await res.json();
        } catch (error) {
            console.error('Error resetting level:', error);
            return { message: 'Connection error', error: true };
        }
    },

    // Use hint
    async useHint(userId, levelId) {
        try {
            const res = await fetch(`${API_BASE}/progress/use-hint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, levelId })
            });
            return await res.json();
        } catch (error) {
            console.error('Error using hint:', error);
            return { hint: 'Check the logs folder for auth.log', hintsUsed: 0 };
        }
    }
};