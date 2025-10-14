/**
 * Firebase Real-time Messaging Chat Service
 * Buyer <-> Farmer Communication with Notifications
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  serverTimestamp,
  limit,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ChatMessage {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'farmer' | 'buyer';
  receiverId: string;
  receiverName: string;
  receiverType: 'farmer' | 'buyer';
  message: string;
  timestamp: any;
  read: boolean;
  orderId?: string;
  cropId?: string;
}

export interface Conversation {
  id?: string;
  participants: string[];
  participantNames: {
    [userId: string]: string;
  };
  participantTypes: {
    [userId: string]: 'farmer' | 'buyer';
  };
  lastMessage: string;
  lastMessageTime: any;
  unreadCount: {
    [userId: string]: number;
  };
  orderId?: string;
  cropId?: string;
  cropName?: string;
}

/**
 * Create or get existing conversation between buyer and farmer
 */
export const getOrCreateConversation = async (
  userId: string,
  userName: string,
  userType: 'farmer' | 'buyer',
  otherUserId: string,
  otherUserName: string,
  otherUserType: 'farmer' | 'buyer',
  orderId?: string,
  cropId?: string,
  cropName?: string
): Promise<string> => {
  try {
    console.log('🔍 Finding or creating conversation...');

    // Check if conversation already exists
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId)
    );

    const querySnapshot = await getDocs(q);
    let existingConversation: any = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(otherUserId)) {
        existingConversation = { id: doc.id, ...data };
      }
    });

    // If conversation exists, return its ID
    if (existingConversation) {
      console.log('✅ Found existing conversation:', existingConversation.id);
      return existingConversation.id;
    }

    // Create new conversation
    console.log('➕ Creating new conversation...');
    const newConversation: Conversation = {
      participants: [userId, otherUserId],
      participantNames: {
        [userId]: userName,
        [otherUserId]: otherUserName
      },
      participantTypes: {
        [userId]: userType,
        [otherUserId]: otherUserType
      },
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      unreadCount: {
        [userId]: 0,
        [otherUserId]: 0
      },
      orderId,
      cropId,
      cropName
    };

    const docRef = await addDoc(conversationsRef, newConversation);
    console.log('✅ New conversation created:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating conversation:', error);
    throw error;
  }
};

/**
 * Send a message in a conversation
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderName: string,
  senderType: 'farmer' | 'buyer',
  receiverId: string,
  receiverName: string,
  receiverType: 'farmer' | 'buyer',
  messageText: string,
  orderId?: string,
  cropId?: string
): Promise<boolean> => {
  try {
    console.log('📤 Sending message...');

    // Add message to messages collection
    const messagesRef = collection(db, 'messages');
    const newMessage: ChatMessage = {
      conversationId,
      senderId,
      senderName,
      senderType,
      receiverId,
      receiverName,
      receiverType,
      message: messageText,
      timestamp: serverTimestamp(),
      read: false,
      orderId,
      cropId
    };

    await addDoc(messagesRef, newMessage);

    // Update conversation with last message
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationDoc = await getDoc(conversationRef);

    if (conversationDoc.exists()) {
      const currentData = conversationDoc.data();
      const currentUnreadCount = currentData.unreadCount || {};

      await updateDoc(conversationRef, {
        lastMessage: messageText,
        lastMessageTime: serverTimestamp(),
        [`unreadCount.${receiverId}`]: (currentUnreadCount[receiverId] || 0) + 1
      });
    }

    console.log('✅ Message sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return false;
  }
};

/**
 * Listen to messages in real-time
 */
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  try {
    console.log('👂 Subscribing to messages for conversation:', conversationId);

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];

      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as ChatMessage);
      });

      console.log('📬 Received', messages.length, 'messages');
      callback(messages);
    });

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error subscribing to messages:', error);
    return () => {};
  }
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (
  userId: string
): Promise<Conversation[]> => {
  try {
    console.log('📋 Getting conversations for user:', userId);

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const conversations: Conversation[] = [];

    querySnapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data()
      } as Conversation);
    });

    console.log('✅ Found', conversations.length, 'conversations');
    return conversations;
  } catch (error) {
    console.error('❌ Error getting conversations:', error);
    return [];
  }
};

/**
 * Subscribe to user conversations in real-time
 */
export const subscribeToConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void
): (() => void) => {
  try {
    console.log('👂 Subscribing to conversations for user:', userId);

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversations: Conversation[] = [];

      snapshot.forEach((doc) => {
        conversations.push({
          id: doc.id,
          ...doc.data()
        } as Conversation);
      });

      console.log('📬 Received', conversations.length, 'conversations');
      callback(conversations);
    });

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error subscribing to conversations:', error);
    return () => {};
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
): Promise<boolean> => {
  try {
    console.log('✅ Marking messages as read for conversation:', conversationId);

    // Update all unread messages for this user
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const updatePromises: Promise<void>[] = [];

    querySnapshot.forEach((document) => {
      const messageRef = doc(db, 'messages', document.id);
      updatePromises.push(updateDoc(messageRef, { read: true }));
    });

    await Promise.all(updatePromises);

    // Reset unread count in conversation
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`unreadCount.${userId}`]: 0
    });

    console.log('✅ Messages marked as read');
    return true;
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    return false;
  }
};

/**
 * Get total unread message count for user
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const conversations = await getUserConversations(userId);
    let totalUnread = 0;

    conversations.forEach((conv) => {
      totalUnread += conv.unreadCount?.[userId] || 0;
    });

    return totalUnread;
  } catch (error) {
    console.error('❌ Error getting unread count:', error);
    return 0;
  }
};

/**
 * Subscribe to unread count in real-time
 */
export const subscribeToUnreadCount = (
  userId: string,
  callback: (count: number) => void
): (() => void) => {
  return subscribeToConversations(userId, (conversations) => {
    let totalUnread = 0;
    conversations.forEach((conv) => {
      totalUnread += conv.unreadCount?.[userId] || 0;
    });
    callback(totalUnread);
  });
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    console.log('🗑️ Deleting conversation:', conversationId);

    // Delete all messages in conversation
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('conversationId', '==', conversationId));
    const querySnapshot = await getDocs(q);

    const deletePromises: Promise<void>[] = [];
    querySnapshot.forEach((document) => {
      deletePromises.push(updateDoc(doc(db, 'messages', document.id), { deleted: true }));
    });

    await Promise.all(deletePromises);

    // Delete conversation
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, { deleted: true });

    console.log('✅ Conversation deleted');
    return true;
  } catch (error) {
    console.error('❌ Error deleting conversation:', error);
    return false;
  }
};

export default {
  getOrCreateConversation,
  sendMessage,
  subscribeToMessages,
  getUserConversations,
  subscribeToConversations,
  markMessagesAsRead,
  getUnreadCount,
  subscribeToUnreadCount,
  deleteConversation
};
