import { createSlice } from '@reduxjs/toolkit';

export const fabricSlice = createSlice({
  name: 'fabric',
  initialState: {
    fabricData: null,
    displayImage: "",
    currentZoom: 0,
    currentWidth: 3
  },
  reducers: {
    setFabricData: (state, action) => {
      state.fabricData = action.payload
    },
    showImage: (state, action) => {
      state.displayImage = action.payload
    },
    setZoomLevel: (state, action) => {
      state.currentZoom = action.payload
    },
    setCurrentWidth: (state, action) => {
      state.currentWidth = action.payload
    }
  },
});

export const { setFabricData, showImage, setZoomLevel, setCurrentWidth } = fabricSlice.actions;

export const selectFabricData = state => state.fabricData;

export default fabricSlice.reducer;
