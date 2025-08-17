import { useState, useRef } from "react";

function ChatBar({ onSend, messages }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

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
      setTimeout(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-xl flex flex-col">
        {/* Historial de mensajes */}
        <div className="flex flex-col gap-2 mb-4 overflow-y-auto" style={{ maxHeight: "350px" }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === "user" ? "self-end" : "self-start"}>
              <div className={msg.role === "user" ? "bg-blue-100 text-blue-900 rounded-lg px-3 py-2" : "bg-gray-200 text-gray-800 rounded-lg px-3 py-2"}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Barra de chat */}
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
