const CookiePreference = require('../models/CookiePreference');
const { v4: uuidv4 } = require('uuid');

/**
 * Controller for handling cookie preference operations
 */
const cookieController = {
  /**
   * Save or update user's cookie preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  savePreferences: async (req, res) => {
    try {
      const { necessary, analytics, marketing, personalization } = req.body;
      
      // Get user ID from authenticated user or generate one for anonymous users
      let userId = req.user ? req.user.id : req.cookies.anonymous_id;
      
      // If no anonymous ID exists, create one and set it as a cookie
      if (!userId) {
        userId = `anon_${uuidv4()}`;
        res.cookie('anonymous_id', userId, { 
          maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 365 * 24 * 60 * 60 * 1000, // 1 year by default
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });
      }
      
      // Get IP address and user agent for audit purposes
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      // Find existing preferences or create new ones
      let cookiePreference = await CookiePreference.findOne({ userId });
      
      if (cookiePreference) {
        // Update existing preferences
        cookiePreference.necessary = necessary !== undefined ? necessary : true;
        cookiePreference.analytics = analytics !== undefined ? analytics : false;
        cookiePreference.marketing = marketing !== undefined ? marketing : false;
        cookiePreference.personalization = personalization !== undefined ? personalization : false;
        cookiePreference.ipAddress = ipAddress;
        cookiePreference.userAgent = userAgent;
        cookiePreference.updatedAt = Date.now();
        
        await cookiePreference.save();
      } else {
        // Create new preferences
        cookiePreference = new CookiePreference({
          userId,
          necessary: necessary !== undefined ? necessary : true,
          analytics: analytics !== undefined ? analytics : false,
          marketing: marketing !== undefined ? marketing : false,
          personalization: personalization !== undefined ? personalization : false,
          ipAddress,
          userAgent
        });
        
        await cookiePreference.save();
      }
      
      // Set cookies based on preferences
      const cookieMaxAge = parseInt(process.env.COOKIE_MAX_AGE) || 365 * 24 * 60 * 60 * 1000; // 1 year by default
      const cookieOptions = {
        maxAge: cookieMaxAge,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      };
      
      if (necessary !== false) {
        res.cookie('necessary_cookies', 'true', cookieOptions);
      }
      
      if (analytics === true) {
        res.cookie('analytics_cookies', 'true', cookieOptions);
      } else {
        res.clearCookie('analytics_cookies');
      }
      
      if (marketing === true) {
        res.cookie('marketing_cookies', 'true', cookieOptions);
      } else {
        res.clearCookie('marketing_cookies');
      }
      
      if (personalization === true) {
        res.cookie('personalization_cookies', 'true', cookieOptions);
      } else {
        res.clearCookie('personalization_cookies');
      }
      
      return res.status(200).json({
        success: true,
        message: 'Cookie preferences saved successfully',
        data: {
          userId,
          preferences: {
            necessary: cookiePreference.necessary,
            analytics: cookiePreference.analytics,
            marketing: cookiePreference.marketing,
            personalization: cookiePreference.personalization
          }
        }
      });
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to save cookie preferences',
        error: error.message
      });
    }
  },
  
  /**
   * Get user's cookie preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getPreferences: async (req, res) => {
    try {
      // Get user ID from authenticated user or anonymous cookie
      const userId = req.user ? req.user.id : req.cookies.anonymous_id;
      
      if (!userId) {
        return res.status(200).json({
          success: true,
          message: 'No cookie preferences found',
          data: {
            preferences: {
              necessary: true,
              analytics: false,
              marketing: false,
              personalization: false
            }
          }
        });
      }
      
      // Find preferences for this user
      const cookiePreference = await CookiePreference.findOne({ userId });
      
      if (!cookiePreference) {
        return res.status(200).json({
          success: true,
          message: 'No cookie preferences found',
          data: {
            preferences: {
              necessary: true,
              analytics: false,
              marketing: false,
              personalization: false
            }
          }
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Cookie preferences retrieved successfully',
        data: {
          userId,
          preferences: {
            necessary: cookiePreference.necessary,
            analytics: cookiePreference.analytics,
            marketing: cookiePreference.marketing,
            personalization: cookiePreference.personalization
          },
          updatedAt: cookiePreference.updatedAt
        }
      });
    } catch (error) {
      console.error('Error getting cookie preferences:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get cookie preferences',
        error: error.message
      });
    }
  }
};

module.exports = cookieController;

