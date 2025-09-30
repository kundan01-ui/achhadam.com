/**
 * WebSocket Service using Socket.IO
 * Provides real-time communication for chat, notifications, and live updates
 */

const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socket mapping
    this.rooms = new Map(); // roomId -> Set of userIds
  }

  /**
   * Initialize Socket.IO server
   */
  initialize(httpServer) {
    this.io = socketIO(httpServer, {
      cors: {
        origin: config.cors.origins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
          logger.security.warn('Socket connection attempt without token', {
            socketId: socket.id,
          });
          return next(new Error('Authentication required'));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, config.jwt.secret);
        socket.userId = decoded.userId;
        socket.userType = decoded.userType;

        logger.api.info('Socket authenticated', {
          socketId: socket.id,
          userId: decoded.userId,
          userType: decoded.userType,
        });

        next();
      } catch (error) {
        logger.security.error('Socket authentication failed', {
          error: error.message,
          socketId: socket.id,
        });
        next(new Error('Authentication failed'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });

    logger.app.info('✅ WebSocket server initialized');
    return this.io;
  }

  /**
   * Handle new socket connection
   */
  handleConnection(socket) {
    logger.api.info('Client connected', {
      socketId: socket.id,
      userId: socket.userId,
      userType: socket.userType,
    });

    // Store connected user
    this.connectedUsers.set(socket.userId, socket);

    // Send connection success
    socket.emit('connected', {
      socketId: socket.id,
      userId: socket.userId,
      timestamp: new Date().toISOString(),
    });

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Chat event handlers
    this.setupChatHandlers(socket);

    // Notification event handlers
    this.setupNotificationHandlers(socket);

    // Marketplace event handlers
    this.setupMarketplaceHandlers(socket);

    // Disconnect handler
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  /**
   * Setup chat event handlers
   */
  setupChatHandlers(socket) {
    // Join chat room
    socket.on('chat:join', ({ roomId }) => {
      socket.join(`chat:${roomId}`);

      // Track room membership
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      this.rooms.get(roomId).add(socket.userId);

      logger.api.info('User joined chat room', {
        socketId: socket.id,
        userId: socket.userId,
        roomId,
      });

      // Notify room members
      socket.to(`chat:${roomId}`).emit('chat:user_joined', {
        userId: socket.userId,
        roomId,
        timestamp: new Date().toISOString(),
      });
    });

    // Leave chat room
    socket.on('chat:leave', ({ roomId }) => {
      socket.leave(`chat:${roomId}`);

      if (this.rooms.has(roomId)) {
        this.rooms.get(roomId).delete(socket.userId);
      }

      logger.api.info('User left chat room', {
        socketId: socket.id,
        userId: socket.userId,
        roomId,
      });

      // Notify room members
      socket.to(`chat:${roomId}`).emit('chat:user_left', {
        userId: socket.userId,
        roomId,
        timestamp: new Date().toISOString(),
      });
    });

    // Send message
    socket.on('chat:message', ({ roomId, message, recipientId }) => {
      const payload = {
        senderId: socket.userId,
        message,
        timestamp: new Date().toISOString(),
        roomId,
      };

      logger.api.debug('Chat message received', {
        socketId: socket.id,
        userId: socket.userId,
        roomId,
        messageLength: message.length,
      });

      // If recipient specified, send directly
      if (recipientId) {
        this.sendToUser(recipientId, 'chat:message', payload);
      } else {
        // Broadcast to room
        socket.to(`chat:${roomId}`).emit('chat:message', payload);
      }

      // Acknowledge sender
      socket.emit('chat:message_sent', {
        roomId,
        timestamp: payload.timestamp,
      });
    });

    // Typing indicator
    socket.on('chat:typing', ({ roomId, isTyping }) => {
      socket.to(`chat:${roomId}`).emit('chat:typing', {
        userId: socket.userId,
        roomId,
        isTyping,
      });
    });

    // Mark messages as read
    socket.on('chat:read', ({ roomId, messageIds }) => {
      socket.to(`chat:${roomId}`).emit('chat:read', {
        userId: socket.userId,
        roomId,
        messageIds,
        timestamp: new Date().toISOString(),
      });
    });
  }

  /**
   * Setup notification event handlers
   */
  setupNotificationHandlers(socket) {
    // Subscribe to notifications
    socket.on('notifications:subscribe', () => {
      socket.join(`notifications:${socket.userId}`);
      logger.api.debug('User subscribed to notifications', {
        userId: socket.userId,
      });
    });

    // Mark notification as read
    socket.on('notifications:read', ({ notificationId }) => {
      logger.api.debug('Notification marked as read', {
        userId: socket.userId,
        notificationId,
      });
    });
  }

  /**
   * Setup marketplace event handlers
   */
  setupMarketplaceHandlers(socket) {
    // Subscribe to marketplace updates
    socket.on('marketplace:subscribe', ({ filters }) => {
      const roomKey = this.generateMarketplaceRoom(filters);
      socket.join(roomKey);
      logger.api.debug('User subscribed to marketplace updates', {
        userId: socket.userId,
        filters,
      });
    });

    // Unsubscribe from marketplace updates
    socket.on('marketplace:unsubscribe', ({ filters }) => {
      const roomKey = this.generateMarketplaceRoom(filters);
      socket.leave(roomKey);
    });
  }

  /**
   * Handle socket disconnect
   */
  handleDisconnect(socket) {
    logger.api.info('Client disconnected', {
      socketId: socket.id,
      userId: socket.userId,
    });

    // Remove from connected users
    this.connectedUsers.delete(socket.userId);

    // Remove from rooms
    this.rooms.forEach((users, roomId) => {
      if (users.has(socket.userId)) {
        users.delete(socket.userId);
        // Notify room members
        this.io.to(`chat:${roomId}`).emit('chat:user_left', {
          userId: socket.userId,
          roomId,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  /**
   * Send event to specific user
   */
  sendToUser(userId, event, data) {
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      socket.emit(event, data);
      return true;
    }
    return false;
  }

  /**
   * Send notification to user
   */
  sendNotification(userId, notification) {
    this.io.to(`notifications:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });

    logger.api.debug('Notification sent', {
      userId,
      type: notification.type,
    });
  }

  /**
   * Broadcast marketplace update
   */
  broadcastMarketplaceUpdate(cropListing, action = 'new') {
    // Broadcast to all marketplace subscribers
    this.io.to('marketplace:all').emit('marketplace:update', {
      action, // 'new', 'update', 'delete'
      cropListing,
      timestamp: new Date().toISOString(),
    });

    logger.api.debug('Marketplace update broadcast', {
      action,
      cropId: cropListing.id,
    });
  }

  /**
   * Broadcast order status update
   */
  broadcastOrderUpdate(orderId, status, userId) {
    this.sendToUser(userId, 'order:update', {
      orderId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Generate marketplace room key from filters
   */
  generateMarketplaceRoom(filters = {}) {
    if (!filters || Object.keys(filters).length === 0) {
      return 'marketplace:all';
    }

    const parts = [];
    if (filters.category) parts.push(`cat:${filters.category}`);
    if (filters.state) parts.push(`state:${filters.state}`);
    if (filters.city) parts.push(`city:${filters.city}`);

    return `marketplace:${parts.join(':')}`;
  }

  /**
   * Get online users count
   */
  getOnlineUsersCount() {
    return this.connectedUsers.size;
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get room members
   */
  getRoomMembers(roomId) {
    return Array.from(this.rooms.get(roomId) || []);
  }
}

// Export singleton instance
const socketService = new SocketService();

module.exports = socketService;