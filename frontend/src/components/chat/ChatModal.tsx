import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  MessageCircle,
  Send,
  Phone,
  X,
  Star,
  Clock,
  CheckCircle,
  Leaf,
  MapPin,
  Package
} from 'lucide-react';
import {
  startChatWithFarmer,
  sendMessage,
  getChatMessages,
  markMessagesAsRead,
  generateFarmerResponse,
  simulateIncomingMessage,
  type ChatMessage,
  type ChatThread
} from '../../services/chatService';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerId: string;
  farmerName: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  farmerRating?: number;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  farmerId,
  farmerName,
  productId,
  productName,
  productImage,
  productPrice,
  farmerRating = 4.5
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat when modal opens
  useEffect(() => {
    if (isOpen && farmerId) {
      initializeChat();
    }
  }, [isOpen, farmerId, productId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      console.log('💬 Initializing chat with farmer:', farmerName);

      const thread = await startChatWithFarmer(
        farmerId,
        farmerName,
        productId,
        productName,
        `Hi ${farmerName}! I'm interested in ${productName ? `your ${productName}` : 'your products'}. Could you please share more details about availability and pricing?`
      );

      setCurrentThread(thread);
      const chatMessages = getChatMessages(thread.id);
      setMessages(chatMessages);

      // Mark messages as read
      markMessagesAsRead(thread.id);

      // Simulate farmer response after 2-3 seconds
      setTimeout(() => {
        simulateFarmerResponse(thread.id);
      }, Math.random() * 2000 + 2000);

      setLoading(false);
    } catch (error) {
      console.error('❌ Error initializing chat:', error);
      setLoading(false);
    }
  };

  const simulateFarmerResponse = (chatId: string) => {
    setTyping(true);
    setTimeout(() => {
      const response = generateFarmerResponse(productName);
      simulateIncomingMessage(chatId, response);
      setTyping(false);

      // Refresh messages
      const updatedMessages = getChatMessages(chatId);
      setMessages(updatedMessages);
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentThread || loading) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const sentMessage = await sendMessage(currentThread.id, messageText);
      setMessages(prev => [...prev, sentMessage]);

      // Simulate farmer response after delay
      setTimeout(() => {
        simulateFarmerResponse(currentThread.id);
      }, Math.random() * 3000 + 1000);

    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickMessages = [
    'Is this still available?',
    'What\'s the best price?',
    'Can I visit your farm?',
    'Do you deliver?',
    'Any bulk discounts?'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <CardHeader className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{farmerName}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < farmerRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-green-600">● Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          {productId && productName && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400 m-3" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{productName}</h4>
                  {productPrice && (
                    <p className="text-green-600 font-semibold">
                      ₹{productPrice}/kg
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Starting conversation...</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderType === 'buyer' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.senderType === 'buyer'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <div
                      className={`flex items-center space-x-1 mt-1 text-xs ${
                        message.senderType === 'buyer'
                          ? 'text-green-100'
                          : 'text-gray-500'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(message.timestamp)}</span>
                      {message.senderType === 'buyer' && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {farmerName} is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>

        {/* Quick Messages */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickMessages.slice(0, 3).map((msg, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setNewMessage(msg)}
                className="text-xs"
              >
                {msg}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${farmerName}...`}
              className="flex-1"
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💬 Chat directly with verified farmers
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatModal;