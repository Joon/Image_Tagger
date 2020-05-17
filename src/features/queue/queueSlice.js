import { createSlice } from '@reduxjs/toolkit';
import { showImage } from '../image/fabricSlice';
import { setError} from '../management/managementSlice';
import axios from 'axios';
import { Auth} from 'aws-amplify';

export const queueSlice = createSlice({
    name: 'queue',
    initialState: {
        queueName: "",
        queueImages: [],
        completedClassifications: [],
        currentItem: null
    },
    reducers: {
        setQueueName: (state, action) =>  {
            state.queueImages = action.payload.availableFiles;
            state.completedClassifications = action.payload.completedClassifications;
            state.queueName = action.payload.queueName;
            state.currentItem = null;
        },
        selectImage: (state, action) => {            
            state.currentItem = action.payload;
        }
    },
});

const { setQueueName, selectImage } = queueSlice.actions;

export default queueSlice.reducer;

axios.defaults.headers.common['Accept'] = 'application/json';

export const setSelectedQueue = (queue) => dispatch => {
    axios.get("https://6ysc4nz5q9.execute-api.eu-west-1.amazonaws.com/default/imgtggr-images?assigned_to=" + queue).then(
        (response) => {
            dispatch(setQueueName({
                availableFiles: response.data.availableFiles,
                completedClassifications: response.data.completedClassifications,
                queueName: queue
            }));
        }
    ).catch((error) => dispatch(setError(error.message)));
}

export const setSelectedImage = (imageName) => (dispatch, getState) => {    
    let availableImages = getState().queue.queueImages;
    let chosenImage = availableImages.find(i => i.name === imageName);
    dispatch(selectImage(chosenImage));
    dispatch(showImage(chosenImage.uri));
}

export const setSelectedUser = () => (dispatch, getState) => {
    //inside some async function, AFTER the user has authenticated with Cognito
    Auth.currentSession().then(tokens => {
        const userName = tokens.getIdToken().payload['name'];
        dispatch(setSelectedQueue(userName));
    });
}
