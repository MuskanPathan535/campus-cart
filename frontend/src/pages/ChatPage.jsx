import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function ChatPage({ user, conversations, selectedChat, setSelectedChat, messages, onSend, onRefresh }) {
  useEffect(() => {
    if (!selectedChat && conversations.length > 0) {
      setSelectedChat(conversations[0]);
    }
  }, [conversations, selectedChat, setSelectedChat]);

  if (!user) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <h3>Login to access chat</h3>
          <p>Send requests to sellers and keep your campus deals organized.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content chat-page">
      <section className="chat-list-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Chats</span>
            <h2>Conversations</h2>
          </div>
          <span>{conversations.length}</span>
        </div>
        {conversations.map((chat) => {
          const other = chat.buyer._id === user.id ? chat.seller : chat.buyer;
          return (
            <button
              key={chat._id}
              type="button"
              className={selectedChat?._id === chat._id ? "chat-row active" : "chat-row"}
              onClick={() => setSelectedChat(chat)}
            >
              <strong>{other.name}</strong>
              <span>{chat.item.title}</span>
              <small>{chat.lastMessage || "Open conversation"}</small>
            </button>
          );
        })}
      </section>

      <section className="chat-panel">
        {selectedChat ? (
          <>
            <div className="section-heading">
              <div>
                <span className="eyebrow">Discussion</span>
                <h2>{selectedChat.item.title}</h2>
              </div>
              <button type="button" className="button button-secondary" onClick={onRefresh}>
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <div className="messages-panel">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message._id} className={message.sender._id === user.id ? "message-bubble mine" : "message-bubble"}>
                    <strong>{message.sender.name}</strong>
                    <p>{message.text}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state compact">No messages yet. Send the first reply.</div>
              )}
            </div>
            <form className="chat-form" onSubmit={onSend}>
              <input name="text" placeholder="Type a message" required />
              <button className="button button-primary" type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="empty-state">Select a chat to view messages.</div>
        )}
      </section>
    </div>
  );
}
