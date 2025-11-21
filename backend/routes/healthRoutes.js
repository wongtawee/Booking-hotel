const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * Health check endpoint
 * Returns system status, database connectivity, and resource usage
 * 
 * @route GET /api/health
 * @access Public
 */
router.get('/health', async (req, res) => {
  try {
    // Check database connection and perform a simple query
    let dbStatus = 'disconnected';
    let dbResponseTime = null;
    
    if (mongoose.connection.readyState === 1) {
      const startTime = Date.now();
      try {
        // Perform a simple database operation to verify connectivity
        await mongoose.connection.db.admin().ping();
        dbResponseTime = Date.now() - startTime;
        dbStatus = 'connected';
      } catch (dbError) {
        dbStatus = 'error';
      }
    }
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    
    const healthCheck = {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()), // seconds
      uptimeFormatted: formatUptime(process.uptime()),
      database: {
        status: dbStatus,
        responseTime: dbResponseTime ? `${dbResponseTime}ms` : null
      },
      environment: process.env.NODE_ENV || 'development',
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB', // Resident Set Size
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
      },
      node: {
        version: process.version,
        platform: process.platform
      }
    };

    const statusCode = dbStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * Format uptime in human-readable format
 * @param {number} seconds - Uptime in seconds
 * @returns {string} Formatted uptime string
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
}

module.exports = router;
