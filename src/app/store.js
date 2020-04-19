import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import fabricReducer from '../features/image/fabricSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    fabric: fabricReducer
  },
});
