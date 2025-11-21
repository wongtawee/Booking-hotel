const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    // Check if user is authenticated (auth middleware should run first)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // Get user from database to check role
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error during authorization' 
    });
  }
};

module.exports = adminMiddleware;
