import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone pour récupérer les déploiements
export const fetchDeployments = createAsyncThunk(
    'project/fetchDeployments',
    async (thunkAPI) => {
        const response = await fetch('https://localhost:3001/pipelines').then(data => {
            console.log(data)
        }); // Remplacez par votre URL API
        if (!response.ok) {
            throw new Error('Failed to fetch deployments');
        }
        return response.json();
    }
);

export const DeployementSlice = createSlice({
    name: 'deployements',
    initialState: {
        deployement: [],
        loading: false,
        error: null,
        // Autres états si nécessaire
    },
    reducers: {
        // Vos reducers existants
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeployments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeployments.fulfilled, (state, action) => {
                state.deployement = action.payload;
                state.loading = false;
            })
            .addCase(fetchDeployments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { addProject, updateStepStatus } = DeployementSlice.actions;

export default DeployementSlice.reducer;
