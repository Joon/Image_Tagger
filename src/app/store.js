import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import counterReducer from '../features/counter/counterSlice';
import fabricReducer from '../features/image/fabricSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    fabric: fabricReducer
  },
  middleware: [thunk]
});
