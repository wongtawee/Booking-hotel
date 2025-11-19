  // server.js
  require('dotenv').config();
  const express = require('express');
  const dotenv = require('dotenv');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const authRoutes = require('./routes/authRoutes');
  const bookingRoutes = require('./routes/bookingRoutes');
  const paymentRoutes = require('./routes/payment');

  dotenv.config();

  const app = express();

  app.use(cors()); // 🔸 สำคัญ
  app.use(express.json());

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

  app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
