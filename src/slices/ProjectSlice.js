// features/project/projectSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const projectSlice = createSlice({
    name: 'project',
    initialState: {
        projects: [
            'front',
            'back'
        ]
    },
    reducers: {
        addProject: (state, action) => {
            state.projects.push(action.payload);
        },
        updateStepStatus: (state, action) => {
            // Logique pour mettre à jour l'état des steps et du projet
        },
        // Autres reducers si nécessaire
    },
});

export const { addProject, updateStepStatus } = projectSlice.actions;

export default projectSlice.reducer;
