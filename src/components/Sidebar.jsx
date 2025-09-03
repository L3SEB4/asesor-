function Sidebar({ chats, currentChatId, onSelectChat, onNewChat }) {
  return (
    <div className="bg-gray-900 text-white w-64 fixed top-0 left-0 h-full flex flex-col p-4 shadow-lg z-10">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4"
        onClick={onNewChat}
      >
        + Nuevo chat
      </button>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">Conversaciones</h2>
        <ul className="space-y-2">
          {chats.length === 0 && (
            <li className="text-gray-400">No hay chats guardados</li>
          )}
          {[...chats].reverse().map((chat) => (
            <li key={chat.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded transition ${chat.id === currentChatId ? 'bg-blue-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => onSelectChat(chat.id)}
              >
                {chat.title || `Chat #${chat.id}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
