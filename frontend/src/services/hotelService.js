import api from './api';

// Get all hotels with pagination and search
export const getAllHotels = async (params = {}) => {
  const { page = 1, limit = 10, search = '' } = params;
  const response = await api.get('/hotels', {
    params: { page, limit, search }
  });
  return response.data;
};

// Get hotel by ID
export const getHotelById = async (id) => {
  const response = await api.get(`/hotels/${id}`);
  return response.data;
};

// Search hotels by location or name
export const searchHotels = async (query) => {
  const response = await api.get('/hotels/search', {
    params: { q: query }
  });
  return response.data;
};

// Admin: Create hotel
export const createHotel = async (hotelData) => {
  const response = await api.post('/hotels', hotelData);
  return response.data;
};

// Admin: Update hotel
export const updateHotel = async (id, hotelData) => {
  const response = await api.put(`/hotels/${id}`, hotelData);
  return response.data;
};

// Admin: Delete hotel
export const deleteHotel = async (id) => {
  const response = await api.delete(`/hotels/${id}`);
  return response.data;
};

export default {
  getAllHotels,
  getHotelById,
  searchHotels,
  createHotel,
  updateHotel,
  deleteHotel
};
