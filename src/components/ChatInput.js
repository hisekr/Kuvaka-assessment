import { FiSend, FiImage } from "react-icons/fi";

export default function ChatInput({
  input,
  setInput,
  fileInputRef,
  handleSend,
  handlePaste,
  previewImage,
  inputRef,
  isTyping,
}) {
  return (
    <div className="border-t p-4 flex items-center gap-2">
      <button
        onClick={() => fileInputRef.current.click()}
        className="text-gray-500 hover:text-gray-700"
      >
        <FiImage size={20} />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => previewImage(e.target.files[0])}
        className="hidden"
      />
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        onPaste={handlePaste}
        placeholder="Type your message..."
        disabled={isTyping}
        className="flex-1 p-2 border rounded bg-[var(--background) bg-[var(--background)] text-[var(--foreground)]] text-[var(--foreground)]"
      />
      <button
        onClick={handleSend}
        disabled={isTyping}
        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
      >
        <FiSend size={16} />
      </button>
    </div>
  );
}
