import { createSlice } from '@reduxjs/toolkit';

export const fabricSlice = createSlice({
  name: 'fabric',
  initialState: {
    fabricData: null,
    activeObject: null,
    displayImage: "",
    currentZoom: 0
  },
  reducers: {
    setFabricData: (state, action) => {
      state.fabricData = action.payload
    },
    setActiveObject: (state, action) => {
      state.activeObject = action.payload
    },
    showImage: (state, action) => {
      state.displayImage = action.payload
    },
    setZoomLevel: (state, action) => {
      state.currentZoom = action.payload
    },
  },
});

export const { setFabricData, setActiveObject, showImage, setZoomLevel } = fabricSlice.actions;

export const selectActiveObject = state => state.activeObject;
export const selectFabricData = state => state.fabricData;

export default fabricSlice.reducer;
