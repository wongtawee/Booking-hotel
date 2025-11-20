// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { validateEnv } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/payment');

// Validate environment variables
validateEnv();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser with increased limit for profile images
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Compression
app.use(compression());

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

  // Request logging middleware (can be replaced with morgan in production)
  app.use((req, res, next) => {
  next();
});
  // Routes
  const healthRoutes = require('./routes/healthRoutes');
  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/hotels', hotelRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/payment', paymentRoutes);

  // Error handling
  const { errorHandler, notFound } = require('./middleware/errorHandler');
  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
