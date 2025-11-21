const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    trim: true,
    enum: {
      values: ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'],
      message: '{VALUE} is not a valid room type'
    }
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [10, 'Capacity cannot exceed 10']
  },
  totalRooms: {
    type: Number,
    required: [true, 'Total rooms is required'],
    min: [1, 'Total rooms must be at least 1'],
    default: 1
  },
  images: {
    type: [String],
    default: []
  },
  amenities: {
    type: [String],
    default: []
  },
  bookedDates: [{
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed'],
      default: 'pending'
    },
    expiresAt: {
      type: Date,
      default: null
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for queries
roomSchema.index({ hotelId: 1 });
roomSchema.index({ roomType: 1 });
roomSchema.index({ pricePerNight: 1 });
roomSchema.index({ isAvailable: 1 });
// Index for booked dates queries
roomSchema.index({ 'bookedDates.checkIn': 1, 'bookedDates.checkOut': 1 });

// Method to check if room is available for given dates
// Excludes expired pending bookings to prevent double booking
roomSchema.methods.isAvailableForDates = function(checkIn, checkOut) {
  const requestStart = new Date(checkIn);
  const requestEnd = new Date(checkOut);
  const now = new Date();
  
  for (const booking of this.bookedDates) {
    // Skip expired pending bookings
    if (booking.status === 'pending' && booking.expiresAt && booking.expiresAt < now) {
      continue;
    }
    
    const bookingStart = new Date(booking.checkIn);
    const bookingEnd = new Date(booking.checkOut);
    
    // Check for overlap
    if (requestStart < bookingEnd && requestEnd > bookingStart) {
      return false;
    }
  }
  
  return true;
};

// Method to get available rooms count for given dates
// Excludes expired pending bookings to prevent double booking
roomSchema.methods.getAvailableRoomsCount = function(checkIn, checkOut) {
  const requestStart = new Date(checkIn);
  const requestEnd = new Date(checkOut);
  const now = new Date();
  
  let bookedCount = 0;
  
  for (const booking of this.bookedDates) {
    // Skip expired pending bookings
    if (booking.status === 'pending' && booking.expiresAt && booking.expiresAt < now) {
      continue;
    }
    
    const bookingStart = new Date(booking.checkIn);
    const bookingEnd = new Date(booking.checkOut);
    
    // Check for overlap
    if (requestStart < bookingEnd && requestEnd > bookingStart) {
      bookedCount++;
    }
  }
  
  return Math.max(0, this.totalRooms - bookedCount);
};

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
