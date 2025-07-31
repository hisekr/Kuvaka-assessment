import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "@/store/slices/messagesSlice";
import { addChatroom, renameChatroom, selectChatroom } from "@/store/slices/chatSlice";
import { nanoid } from "nanoid";
import MessageBubble from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import ImagePreview from "@/components/ImagePreview";

const MESSAGES_PER_PAGE = 20;
const AI_RESPONSE_DELAY = 1500;

export default function ChatInterface() {
  const dispatch = useDispatch();
  const { selectedChatroomId, chatrooms } = useSelector((state) => state.chat);
  const messages = useSelector(
    (state) => state.messages.messagesByChatroom[selectedChatroomId] || []
  );

  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  const paginatedMessages = messages
    .slice()
    .reverse()
    .slice(0, currentPage * MESSAGES_PER_PAGE)
    .reverse();

  const currentChat = chatrooms.find((c) => c.id === selectedChatroomId);

  useEffect(() => {
    if (!isTyping && inputRef.current) inputRef.current.focus();
  }, [isTyping]);

  useEffect(() => {
    setCurrentPage(1);
    requestAnimationFrame(() => {
    scrollToBottom();
  });
  }, [selectedChatroomId]);

  useEffect(() => {
    if (!loadingMore) scrollToBottom();
  }, [messages.length, isTyping]);

  const scrollToBottom = () => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => {
    const ref = chatRef.current;
    if (!ref) return;

    const handleScroll = () => {
      if (ref.scrollTop === 0 && !loadingMore && paginatedMessages.length < messages.length) {
        const prevHeight = ref.scrollHeight;
        setLoadingMore(true);
        setTimeout(() => {
          setCurrentPage((prev) => prev + 1);
          setLoadingMore(false);
          requestAnimationFrame(() => {
            const newHeight = ref.scrollHeight;
            ref.scrollTop = newHeight - prevHeight;
          });
        }, 400);
      }
    };

    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, [loadingMore, paginatedMessages.length, messages.length]);

  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;

    let chatIdToUse = selectedChatroomId;

    if (!selectedChatroomId) {
      const newChatId = nanoid();
      dispatch(addChatroom({ id: newChatId, title: "New Chat", createdAt: Date.now() }));
      dispatch(selectChatroom(newChatId));
      chatIdToUse = newChatId;
      dispatch(addMessage(newChatId, "user", { text: input.trim(), image: imagePreview }));

      if (input.trim()) {
        const words = input.trim().split(/\s+/).slice(0, 4).join(" ");
        dispatch(renameChatroom({ id: newChatId, newTitle: words }));
      }
    } else {
      dispatch(addMessage(selectedChatroomId, "user", { text: input.trim(), image: imagePreview }));
      if (messages.length === 0 && currentChat?.title === "New Chat" && input.trim()) {
        const words = input.trim().split(/\s+/).slice(0, 4).join(" ");
        dispatch(renameChatroom({ id: selectedChatroomId, newTitle: words }));
      }
    }

    setInput("");
    setImagePreview(null);

    if (!isResponding) {
      setIsTyping(true);
      setIsResponding(true);
      setTimeout(() => {
        dispatch(addMessage(chatIdToUse, "ai", { text: generateFakeResponse(input) }));
        setIsTyping(false);
        setIsResponding(false);
      }, AI_RESPONSE_DELAY + Math.random() * 800);
    }
  };

  const generateFakeResponse = () => {
    const replies = ["That's interesting!", "Could you tell me more?", "I see. What else?", "Why do you think that?", "Got it!"];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        previewImage(file);
        e.preventDefault();
      }
    }
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    reader.readAsDataURL(file);
  };

  if (selectedChatroomId === null) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center text-gray-500">Start a new conversation</div>
        <ChatInput
          {...{ input, setInput, fileInputRef, handleSend, handlePaste, previewImage, inputRef, isTyping }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div ref={chatRef} className="h-screen overflow-y-auto px-4 py-6 space-y-4 bg-[var(--background)] text-[var(--foreground)]">
        {loadingMore && <div className="text-center text-sm text-gray-400 py-2 mt-4">Loading more...</div>}
        {paginatedMessages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
        {isTyping && <div className="text-sm text-gray-400 italic">Gemini is typing...</div>}
      </div>

      <ImagePreview imagePreview={imagePreview} onRemove={() => setImagePreview(null)} />
      <ChatInput
        {...{ input, setInput, fileInputRef, handleSend, handlePaste, previewImage, inputRef, isTyping }}
      />
    </div>
  );
}
