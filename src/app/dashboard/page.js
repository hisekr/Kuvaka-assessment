"use client";

import SideBar from "@/components/SideBar";
import ChatInterface from "@/components/ChatInterface";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { rehydrateChatState } from "@/store/slices/chatSlice";
import { rehydrateMessagesState } from "@/store/slices/messagesSlice";
import { getCurrentUserPhone } from "@/store/utils/user";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);

    const phone = getCurrentUserPhone();
    if (phone) {
      const storedChats = JSON.parse(
        localStorage.getItem(`chatState_${phone}`) || "[]"
      );
      const storedMessages = JSON.parse(
        localStorage.getItem(`messagesState_${phone}`) || "{}"
      );

      dispatch(rehydrateChatState({ chatrooms: storedChats }));
      dispatch(rehydrateMessagesState({ messagesByChatroom: storedMessages }));
    }
  }, [dispatch]);

  if (!isMounted) return null;

  return (
    <ProtectedRoute>
      <div className="flex h-full overflow-hidden">
        <div className="w-64 border-r">
          <SideBar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
}
