import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from './slices/chatSlice';
import messagesReducer from './slices/messagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    messages: messagesReducer,
  },
});

store.subscribe(() => {
  if (typeof window !== "undefined") {
    const state = store.getState();
    try {
      localStorage.setItem("authState", JSON.stringify(state.auth));
    } catch (err) {
      console.error("Failed to save auth state", err);
    }
  }
});
