import './App.css'
import ChatBar from './components/ChatBar'
import Sidebar from './components/Sidebar'
import { useState, useRef } from 'react';

function App() {
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const chatEndRef = useRef(null);

  // Encuentra el chat actual o crea uno nuevo si no existe
  const currentChat = chats.find(c => c.id === currentChatId) || { id: currentChatId, messages: [] };

  // Maneja el envío de mensajes
  const handleSend = (msg) => {
    setChats(prev => {
      return prev.map(c =>
        c.id === currentChatId
          ? { ...c, messages: [...(c.messages || []), { role: 'user', text: msg }] }
          : c
      );
    });
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Maneja la creación de un nuevo chat
  const handleNewChat = () => {
    const newId = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    setChats(prev => [...prev, { id: newId, messages: [] }]);
    setCurrentChatId(newId);
  };

  // Selecciona un chat antiguo
  const handleSelectChat = (id) => {
    setCurrentChatId(id);
  };

  return (
    <div className="flex h-full">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <div className="ml-64 flex flex-col bg-gray-200 relative flex-1" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Mensajes alineados a la derecha y scroll automático */}
        <div className="flex-1 flex flex-col items-end px-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          {currentChat.messages.map((msg, idx) => (
            <div key={idx} className="w-full flex justify-end mb-4">
              <div className="bg-blue-100 text-blue-900 rounded-lg px-4 py-3 max-w-xl text-right shadow">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Barra de chat centrada en la ventana del chat, no en toda la pantalla */}
        <div className="absolute bottom-8 left-0 w-full flex justify-center">
          <div className="w-full max-w-xl">
            <ChatBar onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
