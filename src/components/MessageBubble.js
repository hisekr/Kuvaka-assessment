import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";

export default function MessageBubble({ msg }) {
  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
      <div className="max-w-sm relative bg-[var(--background)] text-[var(--foreground)] p-3 rounded-lg text-sm group">
        {msg.text && <p>{msg.text}</p>}
        {msg.image && (
          msg.image === "__IMAGE_TOO_LARGE__" ? (
            <div className="mt-2 p-3 border rounded bg-gray-100 dark:bg-zinc-800 text-sm text-gray-500">
              Previous image cannot be loaded due to size limit.
            </div>
          ) : (
            <img src={msg.image} alt="Uploaded" className="mt-2 rounded max-w-xs" />
          )
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right select-none">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        {msg.text && (
          <button
            onClick={() => handleCopy(msg.text || "")}
            className="absolute top-1 right-1 text-xs text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition"
          >
            <FiCopy size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
