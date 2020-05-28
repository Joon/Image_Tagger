import { createSlice } from '@reduxjs/toolkit';
import { Auth, API } from 'aws-amplify';
import { setError, setLoading } from '../management/managementSlice';
import { advanceQueue } from '../queue/queueSlice';

export const fabricSlice = createSlice({
    name: 'fabric',
    initialState: {
        classificationTypes: [{type: "none", color: "grey"}, {type: "foliage", color: "green"}, 
            {type: "water", color: "blue"}, {type: "building", color: "pink"}, {type: "road", color: "yellow"}],
        fabricData: [],
        displayImage: "",
        currentZoom: 0,
        currentWidth: 3,
        currentClassificationName: "none",
        currentClassificationColor: "gray",
        currentOverride: false
    },
    reducers: {
        setFabricData: (state, action) => {
            if (action.payload) {      
                state.fabricData = action.payload.slice(1);
            } else {
                state.fabricData = [];
            }
        },
        showImage: (state, action) => {            
            state.fabricData = action.payload.fabricData;
            state.displayImage = action.payload.imageUri;
            state.currentZoom = 0;
        },
        setZoomLevel: (state, action) => {
            state.currentZoom = action.payload;
        },
        setCurrentWidth: (state, action) => {
            state.currentWidth = action.payload;
        },
        setClassification: (state, action) => {
            state.currentClassificationColor = action.payload.color;
            state.currentClassificationName = action.payload.type;
        },
        setOverride:  (state, action) => {
            state.currentOverride = action.payload;        
        },
    },
});

export const { setFabricData, showImage, setZoomLevel, setCurrentWidth, setClassification, setOverride } = fabricSlice.actions;

export const selectFabricData = state => state.fabricData;

export const saveClassification = () => async (dispatch, getState) => {        
    let currentClassification = getState().fabric.fabricData;

    if (currentClassification.length === 0) {
        dispatch(setError("Can't save - you haven't classified anything yet"));
        return;
    }

    let noneCount = currentClassification.filter(item => item.category === 'none').length;
    if (noneCount > 0) {
        dispatch(setError("Can't save - you still have " + noneCount + " unclassified cells"));
        return;
    }

    let currentQueue = getState().queue.queueName;
    let currentImage = getState().queue.currentItem;
    let toSave = {
        sourceImageName: currentImage.name,
        classificationSourceQueue: currentQueue,
        classifiedOn: new Date().toLocaleString(),
        classifiedData: currentClassification
    }
    
    const apiName = 'queue';
    const path = '/images/' + currentQueue; 
    const myInit = { 
        headers: { 
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
        body: toSave
    };
    dispatch(setLoading(true));
    API.post(apiName, path, myInit, toSave).then(response => {
        dispatch(advanceQueue(currentImage.name));
        dispatch(setLoading(false));
    })
    .catch(error => {
        dispatch(setError(error.message))
        dispatch(setLoading(false));
    });
}



export default fabricSlice.reducer;
