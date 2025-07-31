import { createSlice, nanoid } from "@reduxjs/toolkit";
import { getCurrentUserPhone } from "@/store/utils/user";

const phone = getCurrentUserPhone();

const storedChats = typeof window !== "undefined" && phone
  ? JSON.parse(localStorage.getItem(`chatState_${phone}`) || "[]")
  : [];


const initialState = {
  chatrooms: storedChats,
  selectedChatroomId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatroom: (state, action) => {
      const newChatroom = action.payload;
      state.chatrooms.unshift(newChatroom);
      const phone = getCurrentUserPhone(); 
      localStorage.setItem(`chatState_${phone}`, JSON.stringify(state.chatrooms));
    },

    deleteChatroom(state, action) {
      const id = action.payload;
      state.chatrooms = state.chatrooms.filter((chat) => chat.id !== id);
      if (state.selectedChatroomId === id) {
        state.selectedChatroomId = null;
      }
      const phone = getCurrentUserPhone();
      localStorage.setItem(`chatState_${phone}`, JSON.stringify(state.chatrooms));
    },
    selectChatroom(state, action) {
      state.selectedChatroomId = action.payload;
    },
    renameChatroom(state, action) {
      const { id, newTitle } = action.payload;
      const chat = state.chatrooms.find(c => c.id === id);
      if (chat) chat.title = newTitle;
      const phone = getCurrentUserPhone();
      localStorage.setItem(`chatState_${phone}`, JSON.stringify(state.chatrooms));
    },
    setChatrooms(state, action) {
      state.chatrooms = action.payload;
      const phone = getCurrentUserPhone();
      localStorage.setItem(`chatState_${phone}`, JSON.stringify(state.chatrooms));
    },

    rehydrateChatState(state, action) {
      state.chatrooms = action.payload.chatrooms;
      state.selectedChatroomId = null;
    },
  },
});

export const {
  addChatroom,
  deleteChatroom,
  selectChatroom,
  renameChatroom,
  setChatrooms,
  rehydrateChatState,
} = chatSlice.actions;

export default chatSlice.reducer;