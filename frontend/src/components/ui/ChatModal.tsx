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
  MessageCircle
} from 'lucide-react';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    if (isOpen) {
      const chatKey = `chat_${buyer.id}_${farmer.id}_${crop.id}`;
      const savedMessages = localStorage.getItem(chatKey);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Initialize with welcome message
        const welcomeMessage: Message = {
          id: `msg_${Date.now()}`,
          senderId: farmer.id,
          senderName: farmer.name,
          senderType: 'farmer',
          message: `नमस्ते! मैं ${crop.name} की फसल बेच रहा हूँ। क्या आप इसमें रुचि रखते हैं?`,
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: true
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [isOpen, buyer.id, farmer.id, crop.id, farmer.name, crop.name]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      const chatKey = `chat_${buyer.id}_${farmer.id}_${crop.id}`;
      localStorage.setItem(chatKey, JSON.stringify(messages));
    }
  }, [messages, buyer.id, farmer.id, crop.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: `msg_${Date.now()}`,
        senderId: buyer.id,
        senderName: buyer.name,
        senderType: 'buyer',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: false
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate farmer response after 2 seconds
      setTimeout(() => {
        const responses = [
          'हाँ, यह फसल बहुत अच्छी है।',
          'क्या आप कीमत के बारे में बात करना चाहते हैं?',
          'मैं आपको बेहतर दाम दे सकता हूँ।',
          'क्या आप इसे देखने आना चाहेंगे?',
          'मेरी फसल 100% ऑर्गेनिक है।'
        ];
        
        const farmerResponse: Message = {
          id: `msg_${Date.now()}`,
          senderId: farmer.id,
          senderName: farmer.name,
          senderType: 'farmer',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: true
        };
        
        setMessages(prev => [...prev, farmerResponse]);
      }, 2000);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('hi-IN', {
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
              <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <Video className="h-5 w-5" />
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: '400px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderType === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderType === 'buyer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <div className="text-sm">{message.message}</div>
                <div className={`text-xs mt-1 ${
                  message.senderType === 'buyer' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                  {message.senderType === 'buyer' && (
                    <CheckCircle className="h-3 w-3 inline ml-1" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Smile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;

