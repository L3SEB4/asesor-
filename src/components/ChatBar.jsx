import { useState, useRef } from "react";

function ChatBar({ onSend }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Ajusta la altura del textarea automáticamente
  const handleInput = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "48px";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-4 bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-xl flex flex-col">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            className="resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 flex-1"
            rows={1}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta..."
            style={{ minHeight: "48px", maxHeight: "200px", overflow: "auto" }}
          />
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBar;
