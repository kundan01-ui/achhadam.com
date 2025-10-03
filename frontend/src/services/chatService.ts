// Chat Service - Buyer-Farmer Communication
import { authenticatedFetch } from './tokenService';
import { apiConfig } from '../config/apiConfig';

// Use centralized API configuration
const API_BASE_URL = apiConfig.baseURL;

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'buyer' | 'farmer';
  recipientId: string;
  message: string;
  messageType: 'text' | 'image' | 'voice' | 'product_inquiry' | 'order_update';
  timestamp: string;
  isRead: boolean;
  productId?: string;
  productName?: string;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  metadata?: {
    orderValue?: number;
    quantity?: number;
    unit?: string;
    urgency?: 'low' | 'medium' | 'high';
  };
}

export interface ChatThread {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  productId?: string;
  productName?: string;
  lastMessage: ChatMessage;
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked';
  createdAt: string;
  updatedAt: string;
  isOnline: boolean;
  farmerRating: number;
  messageCount: number;
}

const CHAT_STORAGE_KEY = 'achhadam_chat_threads';
const MESSAGE_STORAGE_KEY = 'achhadam_chat_messages';
const TYPING_TIMEOUT = 3000; // 3 seconds

// Load chat threads from localStorage
const loadChatThreads = (): ChatThread[] => {
  try {
    const threads = localStorage.getItem(CHAT_STORAGE_KEY);
    return threads ? JSON.parse(threads) : [];
  } catch (error) {
    console.error('❌ Error loading chat threads:', error);
    return [];
  }
};

// Save chat threads to localStorage
const saveChatThreads = (threads: ChatThread[]): void => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(threads));
  } catch (error) {
    console.error('❌ Error saving chat threads:', error);
  }
};

// Load messages for a chat thread
const loadChatMessages = (chatId: string): ChatMessage[] => {
  try {
    const allMessages = localStorage.getItem(MESSAGE_STORAGE_KEY);
    const messages: ChatMessage[] = allMessages ? JSON.parse(allMessages) : [];
    return messages.filter(msg => msg.chatId === chatId).sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch (error) {
    console.error('❌ Error loading chat messages:', error);
    return [];
  }
};

// Save messages to localStorage
const saveChatMessages = (messages: ChatMessage[]): void => {
  try {
    let allMessages: ChatMessage[] = [];
    const existingMessages = localStorage.getItem(MESSAGE_STORAGE_KEY);
    if (existingMessages) {
      allMessages = JSON.parse(existingMessages);
    }

    // Update or add new messages
    messages.forEach(newMsg => {
      const existingIndex = allMessages.findIndex(msg => msg.id === newMsg.id);
      if (existingIndex >= 0) {
        allMessages[existingIndex] = newMsg;
      } else {
        allMessages.push(newMsg);
      }
    });

    localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error('❌ Error saving chat messages:', error);
  }
};

// Start new chat with farmer
export const startChatWithFarmer = async (
  farmerId: string,
  farmerName: string,
  productId?: string,
  productName?: string,
  initialMessage?: string
): Promise<ChatThread> => {
  try {
    console.log('💬 Starting chat with farmer:', { farmerId, farmerName, productId });

    // Check if chat already exists
    const threads = loadChatThreads();
    const existingThread = threads.find(thread =>
      thread.farmerId === farmerId &&
      (!productId || thread.productId === productId)
    );

    if (existingThread) {
      console.log('📱 Found existing chat thread:', existingThread.id);
      return existingThread;
    }

    // Create new chat thread
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const buyerId = localStorage.getItem('userId') || 'buyer_' + Date.now();
    const buyerName = localStorage.getItem('userName') || 'Buyer';

    // Create initial message
    const firstMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: buyerId,
      senderName: buyerName,
      senderType: 'buyer',
      recipientId: farmerId,
      message: initialMessage || `Hi ${farmerName}! I'm interested in ${productName ? `your ${productName}` : 'your products'}. Could you please share more details?`,
      messageType: productId ? 'product_inquiry' : 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      productId,
      productName,
      metadata: productId ? {
        urgency: 'medium'
      } : undefined
    };

    // Create new thread
    const newThread: ChatThread = {
      id: chatId,
      buyerId,
      buyerName,
      farmerId,
      farmerName,
      productId,
      productName,
      lastMessage: firstMessage,
      unreadCount: 0, // For buyer, it's 0 since they sent the message
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnline: false, // Will be updated by real-time sync
      farmerRating: 4.5, // Default rating
      messageCount: 1
    };

    // Save thread and message
    threads.push(newThread);
    saveChatThreads(threads);
    saveChatMessages([firstMessage]);

    // Try to sync with backend
    try {
      await syncChatToBackend(newThread, firstMessage);
    } catch (error) {
      console.warn('⚠️ Failed to sync chat to backend:', error);
    }

    console.log('✅ Chat started successfully:', chatId);
    return newThread;

  } catch (error) {
    console.error('❌ Error starting chat:', error);
    throw error;
  }
};

// Send message
export const sendMessage = async (
  chatId: string,
  message: string,
  messageType: 'text' | 'image' | 'voice' = 'text',
  attachments?: { type: 'image' | 'document'; url: string; name: string; }[]
): Promise<ChatMessage> => {
  try {
    console.log('📤 Sending message:', { chatId, messageType, message: message.substring(0, 50) });

    const threads = loadChatThreads();
    const thread = threads.find(t => t.id === chatId);

    if (!thread) {
      throw new Error('Chat thread not found');
    }

    const senderId = localStorage.getItem('userId') || 'buyer_' + Date.now();
    const senderName = localStorage.getItem('userName') || 'Buyer';

    // Create new message
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      senderId,
      senderName,
      senderType: 'buyer',
      recipientId: thread.farmerId,
      message,
      messageType,
      timestamp: new Date().toISOString(),
      isRead: false,
      productId: thread.productId,
      productName: thread.productName,
      attachments
    };

    // Update thread
    thread.lastMessage = newMessage;
    thread.updatedAt = new Date().toISOString();
    thread.messageCount += 1;

    // Save updates
    saveChatThreads(threads);
    saveChatMessages([newMessage]);

    // Try to sync with backend
    try {
      await syncMessageToBackend(newMessage);
    } catch (error) {
      console.warn('⚠️ Failed to sync message to backend:', error);
    }

    console.log('✅ Message sent successfully');
    return newMessage;

  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error;
  }
};

// Get chat threads for current user
export const getChatThreads = (): ChatThread[] => {
  const threads = loadChatThreads();
  return threads.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

// Get messages for a chat
export const getChatMessages = (chatId: string): ChatMessage[] => {
  return loadChatMessages(chatId);
};

// Mark messages as read
export const markMessagesAsRead = (chatId: string): void => {
  try {
    const threads = loadChatThreads();
    const threadIndex = threads.findIndex(t => t.id === chatId);

    if (threadIndex >= 0) {
      threads[threadIndex].unreadCount = 0;
      saveChatThreads(threads);
    }

    // Mark all messages in this chat as read
    const allMessages = localStorage.getItem(MESSAGE_STORAGE_KEY);
    if (allMessages) {
      const messages: ChatMessage[] = JSON.parse(allMessages);
      let updated = false;

      messages.forEach(msg => {
        if (msg.chatId === chatId && !msg.isRead && msg.senderType === 'farmer') {
          msg.isRead = true;
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
      }
    }

    console.log('✅ Messages marked as read for chat:', chatId);
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
  }
};

// Get unread message count
export const getUnreadMessageCount = (): number => {
  const threads = loadChatThreads();
  return threads.reduce((total, thread) => total + thread.unreadCount, 0);
};

// Delete chat thread
export const deleteChatThread = (chatId: string): void => {
  try {
    // Remove thread
    let threads = loadChatThreads();
    threads = threads.filter(t => t.id !== chatId);
    saveChatThreads(threads);

    // Remove all messages for this chat
    const allMessages = localStorage.getItem(MESSAGE_STORAGE_KEY);
    if (allMessages) {
      const messages: ChatMessage[] = JSON.parse(allMessages);
      const filteredMessages = messages.filter(msg => msg.chatId !== chatId);
      localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(filteredMessages));
    }

    console.log('🗑️ Chat thread deleted:', chatId);
  } catch (error) {
    console.error('❌ Error deleting chat thread:', error);
  }
};

// Send quick inquiry about product
export const sendProductInquiry = async (
  farmerId: string,
  farmerName: string,
  productId: string,
  productName: string,
  inquiryType: 'availability' | 'pricing' | 'quality' | 'delivery' | 'bulk_order' | 'custom'
): Promise<ChatThread> => {

  const inquiryMessages = {
    availability: `Hi ${farmerName}! Is your ${productName} still available? I'm looking to purchase soon.`,
    pricing: `Hello! Could you please share the best price for your ${productName}? I'm interested in bulk purchase.`,
    quality: `Hi! Could you tell me more about the quality and grade of your ${productName}?`,
    delivery: `Hello ${farmerName}! What are the delivery options for your ${productName}? I'm located in [buyer location].`,
    bulk_order: `Hi! I'm interested in a bulk order of your ${productName}. What discounts are available for large quantities?`,
    custom: `Hi ${farmerName}! I'm interested in your ${productName}. Could we discuss the details?`
  };

  const message = inquiryMessages[inquiryType];
  return startChatWithFarmer(farmerId, farmerName, productId, productName, message);
};

// Sync chat to backend
const syncChatToBackend = async (thread: ChatThread, message: ChatMessage): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    await authenticatedFetch('${API_BASE_URL}/api/chat/thread', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        thread,
        initialMessage: message
      })
    });

    console.log('✅ Chat synced to backend');
  } catch (error) {
    console.warn('⚠️ Backend sync failed:', error);
  }
};

// Sync message to backend
const syncMessageToBackend = async (message: ChatMessage): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    await authenticatedFetch('${API_BASE_URL}/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    console.log('✅ Message synced to backend');
  } catch (error) {
    console.warn('⚠️ Message sync failed:', error);
  }
};

// Chat event listeners for real-time updates
let chatListeners: Array<(threads: ChatThread[]) => void> = [];

export const subscribeToChatUpdates = (listener: (threads: ChatThread[]) => void) => {
  chatListeners.push(listener);
  return () => {
    chatListeners = chatListeners.filter(l => l !== listener);
  };
};

const notifyChatListeners = () => {
  const threads = getChatThreads();
  chatListeners.forEach(listener => {
    try {
      listener(threads);
    } catch (error) {
      console.error('❌ Error in chat listener:', error);
    }
  });
};

// Simulate receiving messages (in real app, this would come from websocket)
export const simulateIncomingMessage = (chatId: string, message: string): void => {
  try {
    const threads = loadChatThreads();
    const thread = threads.find(t => t.id === chatId);

    if (!thread) return;

    const incomingMessage: ChatMessage = {
      id: `msg_${Date.now()}_incoming`,
      chatId,
      senderId: thread.farmerId,
      senderName: thread.farmerName,
      senderType: 'farmer',
      recipientId: thread.buyerId,
      message,
      messageType: 'text',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Update thread
    thread.lastMessage = incomingMessage;
    thread.updatedAt = new Date().toISOString();
    thread.unreadCount += 1;
    thread.messageCount += 1;

    saveChatThreads(threads);
    saveChatMessages([incomingMessage]);

    notifyChatListeners();

    console.log('📥 Simulated incoming message');
  } catch (error) {
    console.error('❌ Error simulating incoming message:', error);
  }
};

// Generate sample farmer responses for demo
export const generateFarmerResponse = (productName?: string): string => {
  const responses = [
    `Hello! Thanks for your interest in ${productName || 'my products'}. It's fresh and of premium quality.`,
    `Hi there! Yes, ${productName || 'this item'} is available. The price includes free delivery within 10km.`,
    `Hello! I can offer a good discount for bulk orders. When do you need the ${productName || 'products'}?`,
    `Thanks for reaching out! ${productName || 'This crop'} was harvested yesterday, so it's very fresh.`,
    `Hello! I have organic certification for ${productName || 'all my products'}. Quality is guaranteed.`,
    `Hi! Yes, ${productName || 'this'} is still available. Would you like to visit my farm to see the quality?`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

export default {
  startChatWithFarmer,
  sendMessage,
  getChatThreads,
  getChatMessages,
  markMessagesAsRead,
  getUnreadMessageCount,
  deleteChatThread,
  sendProductInquiry,
  subscribeToChatUpdates
};