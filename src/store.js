// store.js
import { configureStore } from '@reduxjs/toolkit';
import {projectSlice} from "./slices/ProjectSlice";
import {DeployementSlice} from "./slices/DeployementSlice";

export const store = configureStore({
    reducer: {
        projectSlice,
        DeployementSlice
    },
});
