"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  addChatroom,
  deleteChatroom,
  selectChatroom,
  renameChatroom,
} from "@/store/slices/chatSlice";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { FiPlus, FiLogOut, FiTrash } from "react-icons/fi";
import { logout } from "@/store/slices/authSlice";
import { setShowSidebar } from "@/store/slices/uiSlice"; 

export default function Sidebar() {
  const dispatch = useDispatch();
  const { chatrooms, selectedChatroomId } = useSelector((state) => state.chat);
  const [search, setSearch] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");
const debounceTimer = useRef(null);
  const [renameState, setRenameState] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const { isMobile } = useSelector((state) => state.ui); 

  const filteredChatrooms = chatrooms.filter((c) =>
  (c.title || "New Chat").toLowerCase().includes(debouncedSearch.toLowerCase())
);


  const handleNewChat = () => {
    dispatch(selectChatroom(null));
    if (isMobile) {
    dispatch(setShowSidebar(false)); 
  }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chatroom?")) {
      dispatch(deleteChatroom(id));
      toast.info("Chat deleted");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    location.href = "/login";
  };

  const handleSelect = (id) => {
    dispatch(selectChatroom(id));
    if (isMobile) {
    dispatch(setShowSidebar(false)); 
  }
  };

  const startRenaming = (id, currentTitle, e) => {
    e.stopPropagation();
    setRenameState((prev) => ({ ...prev, [id]: currentTitle }));
  };

  const cancelRenaming = (id) => {
    setRenameState((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const confirmRename = (id, e) => {
    e.stopPropagation();
    const newTitle = renameState[id].trim();
    if (!newTitle) {
      toast.error("Chat title cannot be empty");
      return;
    }
    dispatch(renameChatroom({ id, newTitle }));
    toast.success("Chat renamed!");
    cancelRenaming(id);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
  if (debounceTimer.current) clearTimeout(debounceTimer.current);
  debounceTimer.current = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(debounceTimer.current);
}, [search]);


  if (!isMounted) return null;

  return (
    <div className="w-full md:w-64 bg-[var(--background)] text-[var(--foreground)] h-full flex flex-col border-r">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Kuvaka Ai</h2>
        <button
          onClick={handleNewChat}
          className="text-blue-600 hover:text-blue-800"
        >
          <FiPlus />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 text-sm border rounded bg-[var(--background)] text-[var(--foreground)]"
        />
      </div>

      {/* Chatroom list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChatrooms.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-6">No chats</p>
        )}
        {filteredChatrooms.map((chat) => {
          const isSelected = selectedChatroomId === chat.id;
          const isRenaming = renameState.hasOwnProperty(chat.id);

          return (
            <div
              key={chat.id}
              onClick={() => handleSelect(chat.id)}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer
    ${
      isSelected
        ? "bg-[var(--selected-bg)] text-[var(--hover-text)] font-semibold"
        : "bg-[var(--background)] text-[var(--foreground)]"
    }
    hover:bg-[var(--hover-bg)] hover:text-[var(--hover-text)]
    dark:hover:bg-[var(--hover-bg)] dark:hover:text-[var(--hover-text)] 
  `}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {isRenaming ? (
                <input
                  value={renameState[chat.id]}
                  onChange={(e) =>
                    setRenameState((prev) => ({
                      ...prev,
                      [chat.id]: e.target.value,
                    }))
                  }
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmRename(chat.id, e);
                    if (e.key === "Escape") cancelRenaming(chat.id);
                  }}
                  className="flex-1 mr-2 text-sm px-2 py-1 rounded border 
                            bg-[var(--input-bg)] text-[var(--input-text)] 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <span className="truncate flex-1">{chat.title}</span>
              )}

              <div className="flex items-center gap-1 ml-1">
                {isRenaming ? (
                  <button
                    onClick={(e) => confirmRename(chat.id, e)}
                    className="text-green-600 hover:text-green-800 text-sm"
                    title="Save"
                  >
                    ✔
                  </button>
                ) : (
                  <button
                    onClick={(e) => startRenaming(chat.id, chat.title, e)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    title="Rename"
                  >
                    🖉
                  </button>
                )}
                {!isRenaming && (
                  <button
                    onClick={(e) => handleDelete(chat.id, e)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FiTrash size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
