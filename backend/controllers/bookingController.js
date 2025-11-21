const Booking = require('../models/Booking');
const Room = require('../models/Room');
const AppError = require('../utils/AppError');

const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, hotelId, name, email, phone, guests, totalPrice } = req.body;

    // Validate roomId is provided
    if (!roomId) {
      return next(new AppError('Room ID is required', 400));
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return next(new AppError('Room not found', 404));
    }

    // Check if room is available for the requested dates
    if (!room.isAvailableForDates(checkIn, checkOut)) {
      return next(new AppError('Room is not available for the selected dates', 400));
    }

    // Create booking
    const newBooking = new Booking({
      userId: req.user.id,
      hotelId: hotelId || room.hotelId,
      roomId,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'pending'
    });

    const savedBooking = await newBooking.save();

    // Add booking dates to room's bookedDates array
    room.bookedDates.push({
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      bookingId: savedBooking._id
    });
    await room.save();

    res.status(201).json({
      success: true,
      data: savedBooking
    });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('roomId', 'roomType pricePerNight')
      .populate('hotelId', 'name location')
      .sort({ createdAt: -1 });
    
    // Add countdown timer data for pending bookings
    const bookingsWithTimer = bookings.map(booking => {
      const bookingObj = booking.toObject();
      
      if (booking.status === 'pending' && booking.expiresAt) {
        const now = new Date();
        const expiresAt = new Date(booking.expiresAt);
        const remainingMs = expiresAt - now;
        
        bookingObj.remainingTime = {
          milliseconds: Math.max(0, remainingMs),
          minutes: Math.max(0, Math.floor(remainingMs / 60000)),
          seconds: Math.max(0, Math.floor((remainingMs % 60000) / 1000)),
          expired: remainingMs <= 0
        };
      }
      
      return bookingObj;
    });
    
    res.json({
      success: true,
      data: bookingsWithTimer
    });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('roomId', 'roomType pricePerNight capacity amenities images')
      .populate('hotelId', 'name location rating images');
    
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check permission - req.user.id is a string from JWT
    if (booking.userId.toString() !== req.user.id) {
      return next(new AppError('คุณไม่มีสิทธิ์เข้าถึงข้อมูลการจองนี้', 403));
    }

    // Add countdown timer data for pending bookings
    const bookingObj = booking.toObject();
    
    if (booking.status === 'pending' && booking.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(booking.expiresAt);
      const remainingMs = expiresAt - now;
      
      bookingObj.remainingTime = {
        milliseconds: Math.max(0, remainingMs),
        minutes: Math.max(0, Math.floor(remainingMs / 60000)),
        seconds: Math.max(0, Math.floor((remainingMs % 60000) / 1000)),
        expired: remainingMs <= 0
      };
    }

    res.json({
      success: true,
      data: bookingObj
    });
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check permission - req.user.id is a string from JWT
    if (booking.userId.toString() !== req.user.id) {
      return next(new AppError('คุณไม่มีสิทธิ์แก้ไขการจองนี้', 403));
    }

    // Prevent updating cancelled bookings
    if (booking.status === 'cancelled') {
      return next(new AppError('Cannot update a cancelled booking', 400));
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check permission - req.user.id is a string from JWT
    if (booking.userId.toString() !== req.user.id) {
      return next(new AppError('คุณไม่มีสิทธิ์ลบการจองนี้', 403));
    }

    // Remove booking dates from room
    if (booking.roomId) {
      const room = await Room.findById(booking.roomId);
      if (room) {
        // Use .equals() for ObjectId comparison (MongoDB best practice)
        room.bookedDates = room.bookedDates.filter(
          date => !date.bookingId.equals(booking._id)
        );
        await room.save();
      }
    }

    await booking.deleteOne();
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status (admin or payment webhook)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Validate status
    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Use .equals() for ObjectId comparison (MongoDB best practice)
    // Check permission - allow user to cancel their own booking or admin to cancel any booking
    // Note: req.user.id is a string from JWT, so we compare with toString()
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('คุณไม่มีสิทธิ์ยกเลิกการจองนี้', 403));
    }

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return next(new AppError('Booking is already cancelled', 400));
    }

    // Update booking status with cancellation details
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    if (req.body.reason) {
      booking.cancellationReason = req.body.reason;
    }
    await booking.save();

    // Remove booking dates from room
    if (booking.roomId) {
      const room = await Room.findById(booking.roomId);
      if (room) {
        // Use .equals() for ObjectId comparison (MongoDB best practice)
        room.bookedDates = room.bookedDates.filter(
          date => !date.bookingId.equals(booking._id)
        );
        await room.save();
      }
    }

    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('roomId', 'roomType pricePerNight')
      .populate('hotelId', 'name location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
};
