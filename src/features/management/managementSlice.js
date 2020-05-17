import { createSlice } from '@reduxjs/toolkit';

export const managementSlice = createSlice({
    name: 'management',
    initialState: {
        error: ""
    },
    reducers: {
        setError: (state, action) => {            
            state.error = action.payload;
        }
    },
});

export default managementSlice.reducer;

export const selectError = (state) => state.management.error;

export const { setError } = managementSlice.actions;