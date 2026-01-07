import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import Avatar from '../common/Avatar';
import './LiveChat.css';

export default function LiveChat({
  isOpen,
  onClose,
  messages = [],
  currentUser,
  onSendMessage,
  typingUsers = []
}) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="live-chat">
      <div className="chat-header">
        <div className="chat-header-info">
          <h3 className="chat-title">Team Chat</h3>
          <span className="chat-online">{messages.length} messages</span>
        </div>
        <button className="chat-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.userId === currentUser?.id ? 'own' : ''}`}
          >
            {msg.userId !== currentUser?.id && (
              <Avatar src={msg.user?.avatar} name={msg.user?.name} size="sm" />
            )}
            <div className="message-content">
              {msg.userId !== currentUser?.id && (
                <span className="message-sender">{msg.user?.name}</span>
              )}
              <div className="message-bubble">
                <p className="message-text">{msg.text}</p>
              </div>
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="chat-typing">
          <span className="typing-dots">
            <span></span><span></span><span></span>
          </span>
          <span className="typing-text">
            {typingUsers.map(u => u.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      <form className="chat-input" onSubmit={handleSubmit}>
        <button type="button" className="chat-action-btn">
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="button" className="chat-action-btn">
          <Smile size={18} />
        </button>
        <button type="submit" className="chat-send-btn" disabled={!message.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
