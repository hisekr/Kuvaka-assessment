import { createSlice, nanoid } from '@reduxjs/toolkit';
import { getCurrentUserPhone } from '@/store/utils/user';


const MAX_IMAGE_SIZE = 100 * 1024; 

const phone = getCurrentUserPhone();

const storedMessages = typeof window !== "undefined" && phone
  ? JSON.parse(localStorage.getItem(`messagesState_${phone}`) || "{}")
  : {};


  const initialState = {
  messagesByChatroom: storedMessages,
};

const persistMessages = (state) => {
  try {
    const phone = getCurrentUserPhone();
    localStorage.setItem(`messagesState_${phone}`, JSON.stringify(state.messagesByChatroom));
  } catch (e) {
    console.warn("LocalStorage full. Skipping image save.");
  }
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: {
      reducer(state, action) {
        const { chatroomId, message } = action.payload;
        if (!state.messagesByChatroom[chatroomId]) {
          state.messagesByChatroom[chatroomId] = [];
        }

        const clonedMessage = { ...message };

        if (clonedMessage.image?.length > MAX_IMAGE_SIZE) {
          clonedMessage.image = "__IMAGE_TOO_LARGE__";
        }

        state.messagesByChatroom[chatroomId].push(message);
        persistMessages(state);
      },
      prepare(chatroomId, type, content) {
        return {
          payload: {
            chatroomId,
            message: {
              id: nanoid(),
              type,
              text: content.text || '',
              image: content.image || null,
              timestamp: Date.now(),
            },
          },
        };
      },
    },

    setMessages(state, action) {
      state.messagesByChatroom = action.payload;
      persistMessages(state);
    },

    deleteMessagesForChatroom(state, action) {
      delete state.messagesByChatroom[action.payload];
      persistMessages(state);
    },

    rehydrateMessagesState(state, action) {
      state.messagesByChatroom = action.payload.messagesByChatroom;
    },
  },
});

export const {
  addMessage,
  setMessages,
  deleteMessagesForChatroom,
  rehydrateMessagesState,
} = messagesSlice.actions;

export default messagesSlice.reducer;
