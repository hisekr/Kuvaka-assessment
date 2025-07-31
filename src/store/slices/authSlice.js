import { createSlice } from "@reduxjs/toolkit";

let initialAuth = {
  isAuthenticated: false,
  user: null,
  signupNumbers: [],
};

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("authState");
    if (stored) {
      initialAuth = JSON.parse(stored);
    }
  } catch (err) {
    console.error("Failed to parse authState from localStorage", err);
  }
}

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuth,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    signup: (state, action) => {
      state.signupNumbers.push(action.payload.phone);
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
});

export const { login, logout, signup } = authSlice.actions;
export default authSlice.reducer;
