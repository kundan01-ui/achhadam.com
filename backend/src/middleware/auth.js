const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    console.log('🔍 AUTH MIDDLEWARE: Starting authentication...');
    console.log('🔍 AUTH MIDDLEWARE: Request URL:', req.url);
    console.log('🔍 AUTH MIDDLEWARE: Request Method:', req.method);
    
    const authHeader = req.header('Authorization');
    console.log('🔍 AUTH MIDDLEWARE: Authorization header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('🔍 AUTH MIDDLEWARE: Extracted token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    if (!token) {
      console.log('❌ AUTH MIDDLEWARE: No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    console.log('🔍 AUTH MIDDLEWARE: Verifying token with JWT_SECRET...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('🔍 AUTH MIDDLEWARE: Token decoded successfully:', {
      userId: decoded.userId,
      userType: decoded.userType,
      phone: decoded.phone,
      exp: decoded.exp,
      iat: decoded.iat
    });
    
    console.log('🔍 AUTH MIDDLEWARE: Looking up user in database with ID:', decoded.userId);
    const user = await User.findOne({ userId: decoded.userId });
    console.log('🔍 AUTH MIDDLEWARE: User found in database:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('❌ AUTH MIDDLEWARE: User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    console.log('🔍 AUTH MIDDLEWARE: User details:', {
      userId: user.userId,
      userType: user.userType,
      email: user.email,
      phone: user.phone
    });

    req.user = {
      userId: user.userId,
      userType: user.userType,
      email: user.email,
      phone: user.phone
    };
    
    console.log('✅ AUTH MIDDLEWARE: Authentication successful');
    next();
  } catch (error) {
    console.error('❌ AUTH MIDDLEWARE: Authentication error:', error);
    console.error('❌ AUTH MIDDLEWARE: Error details:', {
      name: error.name,
      message: error.message,
      expiredAt: error.expiredAt
    });
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

module.exports = auth;




