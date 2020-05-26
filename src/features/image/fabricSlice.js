import { createSlice } from '@reduxjs/toolkit';

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
      state.displayImage = action.payload;
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

export default fabricSlice.reducer;
