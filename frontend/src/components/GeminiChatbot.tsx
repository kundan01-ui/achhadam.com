import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, Bot, User, Loader, Minimize2, EyeOff } from 'lucide-react';
import { sendMessageToGemini, ChatMessage } from '../services/geminiService';
import achhadamLogo from '../assets/achhadam logo.jpg';

type ChatbotState = 'hidden' | 'minimized' | 'open';

const GeminiChatbot: React.FC = () => {
  const [chatState, setChatState] = useState<ChatbotState>(() => {
    const saved = localStorage.getItem('achhadam_chatbot_state');
    return (saved as ChatbotState) || 'minimized';
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'नमस्ते! मैं ACHHADAM AI Assistant हूं। 🌾\n\nमैं आपकी खेती से जुड़े सवालों में मदद कर सकता हूं:\n• फसल की देखभाल\n• बाजार की जानकारी\n• मौसम संबंधी सलाह\n• प्लेटफॉर्म की सुविधाएं\n\nआप मुझसे हिंदी, English या Marathi में पूछ सकते हैं!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save chatbot state to localStorage
  useEffect(() => {
    localStorage.setItem('achhadam_chatbot_state', chatState);
  }, [chatState]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMessage.content, messages);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.success
          ? response.message!
          : `क्षमा करें, मुझे जवाब देने में समस्या आई। कृपया दोबारा कोशिश करें।\n\nError: ${response.error}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'क्षमा करें, कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'फसल की देखभाल कैसे करें?',
    'मौसम की सलाह',
    'बाजार की कीमतें',
    'How to use ACHHADAM?'
  ];

  return (
    <>
      {/* Chatbot Button - Floating - Mobile Responsive */}
      {chatState === 'minimized' && (
        <button
          onClick={() => setChatState('open')}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 group"
          aria-label="Open AI Chatbot"
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            AI से पूछें 🤖
          </div>
        </button>
      )}

      {/* Chatbot Window - Mobile Responsive */}
      {chatState === 'open' && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:bottom-6 sm:right-6 z-50 w-full h-full sm:w-96 sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-gray-200">
          {/* Header with Company Logo */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Company Logo */}
              <div className="bg-white rounded-full p-0.5 flex items-center justify-center overflow-hidden w-10 h-10 sm:w-12 sm:h-12">
                <img
                  src={achhadamLogo}
                  alt="ACHHADAM Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">ACHHADAM AI</h3>
                <p className="text-[10px] sm:text-xs text-green-100">Powered by Google Gemini</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setChatState('hidden')}
                className="hover:bg-white/20 p-1.5 sm:p-2 rounded-lg transition"
                title="Hide chatbot"
              >
                <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={() => setChatState('minimized')}
                className="hover:bg-white/20 p-1.5 sm:p-2 rounded-lg transition"
                title="Minimize"
              >
                <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={() => setChatState('minimized')}
                className="hover:bg-white/20 p-1.5 sm:p-2 rounded-lg transition"
                title="Close"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Messages Container - Mobile Responsive */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  )}
                </div>
                <div className={`flex-1 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                  }`}>
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 px-2">
                    {msg.timestamp.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 p-2.5 sm:p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Mobile Responsive */}
          {messages.length === 1 && !isLoading && (
            <div className="px-3 py-2 sm:px-4 sm:py-2 bg-white border-t border-gray-200">
              <p className="text-[10px] sm:text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(q)}
                    className="text-[10px] sm:text-xs bg-green-50 text-green-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full hover:bg-green-100 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area - Mobile Responsive */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200 safe-area-bottom">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="अपना सवाल पूछें..."
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-2 text-center">
              AI may make mistakes. Verify important info.
            </p>
          </div>
        </div>
      )}

      {/* Hidden State - Small Show Button */}
      {chatState === 'hidden' && (
        <button
          onClick={() => setChatState('minimized')}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition-all duration-300 opacity-50 hover:opacity-100"
          title="Show chatbot"
          aria-label="Show AI Chatbot"
        >
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}
    </>
  );
};

export default GeminiChatbot;
