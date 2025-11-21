import api from './api';

// Create booking
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

// Get my bookings
export const getMyBookings = async () => {
  const response = await api.get('/bookings/me');
  return response.data;
};

// Get booking by ID
export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// Update booking
export const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/bookings/${id}`, bookingData);
  return response.data;
};

// Delete booking
export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// Update booking status
export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data;
};

// Cancel booking
export const cancelBooking = async (id, data = {}) => {
  const response = await api.patch(`/bookings/${id}/cancel`, data);
  return response.data;
};

// Admin: Get all bookings
export const getAllBookings = async (params = {}) => {
  const { status, page = 1, limit = 10 } = params;
  const response = await api.get('/bookings/admin/all', {
    params: { status, page, limit }
  });
  return response.data;
};

export default {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
};
