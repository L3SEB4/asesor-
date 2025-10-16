import './App.css'
import ChatBar from './components/ChatBar'
import Sidebar from './components/Sidebar'
import { useState, useRef } from 'react';

// Función para enviar el mensaje a la función de Firebase y obtener la respuesta de la IA
async function sendMessageToAI(message) {
  try {
    const response = await fetch(
      'https://us-central1-asessor-ec9b6.cloudfunctions.net/chatWithAI',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      }
    );
    const data = await response.json();
    return data.reply || 'Sin respuesta de la IA';
  } catch (error) {
    return 'Error al conectar con la IA';
  }
}

function App() {
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const chatEndRef = useRef(null);

  // Encuentra el chat actual o crea uno nuevo si no existe
  const currentChat = chats.find(c => c.id === currentChatId) || { id: currentChatId, messages: [] };

  // Maneja el envío de mensajes
  const handleSend = async (msg) => {
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

    // Llama a la función de Firebase y agrega la respuesta de la IA
    const aiReply = await sendMessageToAI(msg);
    setChats(prev => {
      return prev.map(c =>
        c.id === currentChatId
          ? { ...c, messages: [...(c.messages || []), { role: 'assistant', text: aiReply }] }
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
        <div className="flex-1 flex flex-col items-end px-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {currentChat.messages.map((msg, idx) => (
            <div key={idx} className="w-full flex justify-end mb-4">
              <div className="bg-blue-100 text-blue-900 rounded-lg px-4 py-3 max-w-xl text-right shadow break-words whitespace-pre-line inline-block">
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
