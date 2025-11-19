const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: String,
  hotelId: String,
  name: String,
  email: String,
  phone: String,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
