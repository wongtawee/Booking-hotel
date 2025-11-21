import api from './api';

// Get rooms by hotel ID
export const getRoomsByHotel = async (hotelId) => {
  const response = await api.get(`/rooms/hotel/${hotelId}`);
  return response.data;
};

// Get room by ID
export const getRoomById = async (id) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

// Check room availability
export const checkAvailability = async (roomId, checkIn, checkOut) => {
  const response = await api.post('/rooms/check-availability', {
    roomId,
    checkIn,
    checkOut
  });
  return response.data;
};

// Admin: Create room
export const createRoom = async (roomData) => {
  const response = await api.post('/rooms', roomData);
  return response.data;
};

// Admin: Update room
export const updateRoom = async (id, roomData) => {
  const response = await api.put(`/rooms/${id}`, roomData);
  return response.data;
};

// Admin: Delete room
export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};

export default {
  getRoomsByHotel,
  getRoomById,
  checkAvailability,
  createRoom,
  updateRoom,
  deleteRoom
};
