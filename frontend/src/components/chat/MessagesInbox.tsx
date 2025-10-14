/**
 * Messages Inbox Component
 * Shows all conversations for farmer with buyers
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Clock, Search, X } from 'lucide-react';
import {
  subscribeToConversations,
  type Conversation
} from '../../services/firebaseMessagingChat';
import ChatWindow from './ChatWindow';

interface MessagesInboxProps {
  farmerId: string;
  farmerName: string;
}

const MessagesInbox: React.FC<MessagesInboxProps> = ({ farmerId, farmerName }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to conversations
  useEffect(() => {
    console.log('📬 Loading conversations for farmer:', farmerId);

    const unsubscribe = subscribeToConversations(farmerId, (convs) => {
      setConversations(convs);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [farmerId]);

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;

    const buyerName = Object.entries(conv.participantNames).find(
      ([id]) => id !== farmerId
    )?.[1] || '';

    return (
      buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.cropName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getOtherParticipant = (conv: Conversation) => {
    const otherId = conv.participants.find((id) => id !== farmerId) || '';
    return {
      id: otherId,
      name: conv.participantNames[otherId] || 'Unknown',
      type: conv.participantTypes[otherId] || 'buyer'
    };
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleOpenChat = (conv: Conversation) => {
    setSelectedConversation(conv);
  };

  const handleCloseChat = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-green-600" />
            Messages
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Chat with buyers about your crops
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {conversations.reduce((acc, conv) => acc + (conv.unreadCount?.[farmerId] || 0), 0)} unread
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {searchQuery
                ? 'Try a different search term'
                : 'Buyers will contact you about your crops'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const other = getOtherParticipant(conv);
            const unreadCount = conv.unreadCount?.[farmerId] || 0;

            return (
              <button
                key={conv.id}
                onClick={() => handleOpenChat(conv)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-green-700" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {other.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>

                    {conv.cropName && (
                      <p className="text-xs text-green-600 mb-1">
                        About: {conv.cropName}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {unreadCount > 0 && (
                    <div className="bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Chat Window */}
      {selectedConversation && (
        <ChatWindow
          conversationId={selectedConversation.id!}
          currentUserId={farmerId}
          currentUserName={farmerName}
          currentUserType="farmer"
          otherUserId={getOtherParticipant(selectedConversation).id}
          otherUserName={getOtherParticipant(selectedConversation).name}
          otherUserType="buyer"
          orderId={selectedConversation.orderId}
          cropId={selectedConversation.cropId}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default MessagesInbox;
