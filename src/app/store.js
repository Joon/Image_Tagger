import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import fabricReducer from '../features/image/fabricSlice';
import queueReducer from '../features/queue/queueSlice';
import managementReducer from '../features/management/managementSlice';

export default configureStore({
    reducer: {    
        fabric: fabricReducer,
        queue: queueReducer,
        management: managementReducer
    },
    middleware: [thunk]
});

