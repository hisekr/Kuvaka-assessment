import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  showSidebar: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    toggleSidebar(state) {
      state.showSidebar = !state.showSidebar;
    },
    setShowSidebar(state, action) {
      state.showSidebar = action.payload;
    },
  },
});

export const { setIsMobile, toggleSidebar, setShowSidebar } = uiSlice.actions;
export default uiSlice.reducer;
