const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all rooms for a hotel
// @route   GET /api/hotels/:hotelId/rooms
// @access  Public
const getRoomsByHotel = async (req, res, next) => {
  try {
    const rooms = await Room.find({ hotelId: req.params.hotelId });

    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotelId');

    if (!room) {
      return next(new AppError('Room not found', 404));
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    // Check if hotel exists
    const hotel = await Hotel.findById(req.body.hotelId);
    if (!hotel) {
      return next(new AppError('Hotel not found', 404));
    }

    const room = await Room.create(req.body);

    // Add room to hotel's rooms array
    hotel.rooms.push(room._id);
    await hotel.save();

    res.status(201).json({
      success: true,
      data: room,
      message: 'Room created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!room) {
      return next(new AppError('Room not found', 404));
    }

    res.status(200).json({
      success: true,
      data: room,
      message: 'Room updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return next(new AppError('Room not found', 404));
    }

    // Remove room from hotel's rooms array
    await Hotel.findByIdAndUpdate(
      room.hotelId,
      { $pull: { rooms: room._id } }
    );

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability
// @route   POST /api/rooms/check-availability
// @access  Public
const checkRoomAvailability = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return next(new AppError('Room ID, check-in and check-out dates are required', 400));
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return next(new AppError('Room not found', 404));
    }

    // Get available rooms count for the given dates
    const availableRooms = room.getAvailableRoomsCount(checkIn, checkOut);
    const isAvailable = availableRooms > 0;

    res.status(200).json({
      success: true,
      data: {
        roomId,
        available: isAvailable,
        availableRooms: availableRooms,
        totalRooms: room.totalRooms,
        checkIn,
        checkOut
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkRoomAvailability
};
