import './App.css'
import ChatBar from './components/ChatBar'
import Sidebar from './components/Sidebar'
import { useState } from 'react';

function App() {
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);

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
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <div className="flex-1">
        <ChatBar
          onSend={handleSend}
          messages={currentChat.messages || []}
        />
      </div>
    </div>
  );
}

export default App;
