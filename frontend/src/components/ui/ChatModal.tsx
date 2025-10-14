import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreVertical,
  User,
  MapPin,
  Clock,
  CheckCircle,
  MessageCircle,
  Loader2
} from 'lucide-react';
import {
  getOrCreateConversation,
  sendMessage as sendFirebaseMessage,
  subscribeToMessages,
  markMessagesAsRead,
  type ChatMessage
} from '../../services/firebaseMessagingChat';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'buyer' | 'farmer';
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'file';
  isRead: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: {
    id: string;
    name: string;
    phone: string;
    location: string;
    rating: number;
    avatar?: string;
  };
  crop: {
    id: string;
    name: string;
    type: string;
    variety: string;
    quantity: number;
    unit: string;
    price: number;
    quality: string;
    location: string;
    harvestDate: string;
    organic: boolean;
    images: any[];
  };
  buyer: {
    id: string;
    name: string;
    phone: string;
    location: string;
  };
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  farmer,
  crop,
  buyer
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation and subscribe to messages
  useEffect(() => {
    if (!isOpen) return;

    let unsubscribe: (() => void) | null = null;

    const initChat = async () => {
      try {
        setLoading(true);
        console.log('💬 Initializing chat between buyer and farmer...');

        // Create or get existing conversation
        const convId = await getOrCreateConversation(
          buyer.id,
          buyer.name,
          'buyer',
          farmer.id,
          farmer.name,
          'farmer',
          crop.id,
          crop.id,
          crop.name
        );

        setConversationId(convId);

        // Subscribe to messages
        unsubscribe = subscribeToMessages(convId, (newMessages) => {
          setMessages(newMessages);
          setLoading(false);

          // Mark messages as read
          markMessagesAsRead(convId, buyer.id);
        });
      } catch (error) {
        console.error('❌ Error initializing chat:', error);
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isOpen, buyer.id, buyer.name, farmer.id, farmer.name, crop.id, crop.name]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !conversationId) return;

    setSending(true);

    try {
      const success = await sendFirebaseMessage(
        conversationId,
        buyer.id,
        buyer.name,
        'buyer',
        farmer.id,
        farmer.name,
        'farmer',
        newMessage.trim(),
        crop.id,
        crop.id
      );

      if (success) {
        setNewMessage('');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{farmer.name}</h3>
                <p className="text-sm opacity-90">{crop.name} - {crop.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open(`tel:${farmer.phone}`)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Call Farmer"
              >
                <Phone className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Crop Info Bar */}
        <div className="bg-gray-50 border-b border-gray-200 p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {farmer.location}
              </span>
              <span className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {crop.quantity} {crop.unit}
              </span>
              <span className="text-green-600 font-semibold">
                ₹{crop.price}/{crop.unit === 'kg' ? 'kg' : 'quintal'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {crop.quality} Grade
              </span>
              {crop.organic && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                  Organic
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ height: '400px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-lg font-medium">Start conversation with farmer</p>
                <p className="text-sm">Ask about price, quality, delivery, etc.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderType === 'buyer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderType === 'buyer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="text-sm">{message.message}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.senderType === 'buyer' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                    {message.senderType === 'buyer' && message.read && (
                      <CheckCircle className="h-3 w-3 inline ml-1" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
              placeholder="Type your message..."
              disabled={sending || loading}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending || loading}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Enter to send message</p>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;


