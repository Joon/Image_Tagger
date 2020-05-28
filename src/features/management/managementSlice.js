import { createSlice } from '@reduxjs/toolkit';
import { notification } from 'antd';

export const managementSlice = createSlice({
    name: 'management',
    initialState: {
        error: "",
        loading: false
    },
    reducers: {
        setError: (state, action) => {            
            state.error = action.payload;
            notification.error({
                message: 'Error',
                description: state.error,
                placement: 'topRight'
              });
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export default managementSlice.reducer;

export const selectError = (state) => state.management.error;
export const selectLoading = (state) => state.management.loading;

export const { setError, setLoading } = managementSlice.actions;
