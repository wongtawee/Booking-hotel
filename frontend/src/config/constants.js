// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Stripe Configuration
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

// API Endpoints (for direct fetch calls - includes /api prefix)
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    UPDATE_PROFILE: '/api/auth/me'
  },
  
  // Hotels
  HOTELS: {
    BASE: '/api/hotels',
    BY_ID: (id) => `/api/hotels/${id}`,
    SEARCH: '/api/hotels/search'
  },
  
  // Rooms
  ROOMS: {
    BASE: '/api/rooms',
    BY_ID: (id) => `/api/rooms/${id}`,
    BY_HOTEL: (hotelId) => `/api/hotels/${hotelId}/rooms`,
    CHECK_AVAILABILITY: '/api/rooms/check-availability'
  },
  
  // Bookings
  BOOKINGS: {
    BASE: '/api/bookings',
    BY_ID: (id) => `/api/bookings/${id}`,
    MY_BOOKINGS: '/api/bookings/me',
    UPDATE_STATUS: (id) => `/api/bookings/${id}/status`,
    CANCEL: (id) => `/api/bookings/${id}/cancel`
  },
  
  // Payment
  PAYMENT: {
    CREATE_INTENT: '/api/payment/create-payment-intent',
    CONFIRM_PAYMENT: '/api/payment/confirm-payment'
  }
};

// Note: Service files using axios instance don't need /api prefix
// because it's already included in the baseURL

// App Configuration
export const APP_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};
