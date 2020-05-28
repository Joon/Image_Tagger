import { createSlice } from '@reduxjs/toolkit';
import { showImage } from '../image/fabricSlice';
import { setError, setLoading} from '../management/managementSlice';
import { Auth, API } from 'aws-amplify';

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
        },
        selectImage: (state, action) => {            
            state.currentItem = action.payload;
        }
    },
});

const { setQueueName, selectImage } = queueSlice.actions;

export default queueSlice.reducer;

export const setSelectedQueue = (queue) => async dispatch => {
    const apiName = 'queue';
    const path = '/images/' + queue; 

    const myInit = { 
        headers: { 
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };
    dispatch(setLoading(true));
    API.get(apiName, path, myInit).then(response => {
        console.log(response);
        dispatch(setQueueName({
            availableFiles: response.availableFiles,
            completedClassifications: response.completedClassifications,
            queueName: queue
        }));
        dispatch(setLoading(false));
    })
    .catch(error => {
        dispatch(setError(error.message))
        dispatch(setLoading(false));
    });
}

function displayWithPrevClassification(dispatch, chosenImageUri, classificationUri) {
    const axios = require('axios');

    // Make a request for a user with a given ID
    axios.get(classificationUri)
        .then(function (response) {
            dispatch(showImage({imageUri: chosenImageUri, fabricData: response.data.classifiedData}));
        })
        .catch(function (error) {
            dispatch(setError(JSON.stringify(error)))
        });
}

export const setSelectedImage = (imageName) => async (dispatch, getState) => {    
    let availableImages = getState().queue.queueImages;
    let chosenImage = availableImages.find(i => i.name === imageName || i.name + "**" === imageName);
    dispatch(selectImage(chosenImage));
    if (getState().queue.completedClassifications.some(c => c.name === imageName)) {
        let completedClassification = getState().queue.completedClassifications.find(c => c.name === imageName);
        await displayWithPrevClassification(dispatch, chosenImage.uri, completedClassification.uri);
    } else {
        dispatch(showImage({imageUri: chosenImage ? chosenImage.uri : "", fabricData: []}));
    }    
}

export const setSelectedUser = () => (dispatch, getState) => {
    //inside some async function, AFTER the user has authenticated with Cognito
    Auth.currentSession().then(tokens => {
        const userName = tokens.getIdToken().payload['name'];
        dispatch(setSelectedQueue(userName));
    });
}

export const advanceQueue = (prevImageName) => async (dispatch, getState) => {    
    // refresh the queue to get the latest classifications reloaded
    dispatch(setSelectedQueue(getState().queue.queueName));

    // now we advance the queue position 1 on
    let availableImages = getState().queue.queueImages;
    let currentIx = availableImages.findIndex(img => img.name === prevImageName);
    if (currentIx < availableImages.length - 2) {
        let newImage = availableImages[currentIx + 1].name;
        console.log("Advancing queue to " + newImage);
        dispatch(setSelectedImage(newImage));
    }
}