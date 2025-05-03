import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';

interface Message {
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
}

interface SupportTicketChatProps {
  ticketId: string;
  initialMessages: Message[];
  onSendMessage: (message: string) => Promise<void>;
}

const SupportTicketChat: React.FC<SupportTicketChatProps> = ({
  ticketId,
  initialMessages,
  onSendMessage
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Initialize socket with ticket events
  const { isConnected, joinRoom, leaveRoom } = useSocket({
    events: {
      ticket_message: (data: any) => {
        if (data.ticketId === ticketId) {
          setMessages(prev => [...prev, data.message]);
        }
      }
    },
    useNewImplementation: true
  });

  // Join ticket room on mount
  useEffect(() => {
    joinRoom(ticketId);
    
    // Leave room on unmount
    return () => {
      leaveRoom(ticketId);
    };
  }, [ticketId, joinRoom, leaveRoom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;
    
    try {
      setSending(true);
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="support-ticket-chat">
      <div className="chat-header">
        <h3>Support Ticket #{ticketId}</h3>
        <div className="connection-status">
          {isConnected ? (
            <span className="status-connected">Connected</span>
          ) : (
            <span className="status-disconnected">Disconnected</span>
          )}
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.sender === 'user' ? 'user-message' : 'support-message'}`}
            >
              <div className="message-content">{msg.message}</div>
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={sending || !isConnected}
        />
        <button 
          type="submit" 
          disabled={sending || !newMessage.trim() || !isConnected}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default SupportTicketChat; 