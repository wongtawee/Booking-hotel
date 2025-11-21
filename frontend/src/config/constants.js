// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Stripe Configuration
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/me'
  },
  
  // Hotels
  HOTELS: {
    BASE: '/hotels',
    BY_ID: (id) => `/hotels/${id}`,
    SEARCH: '/hotels/search'
  },
  
  // Rooms
  ROOMS: {
    BASE: '/rooms',
    BY_ID: (id) => `/rooms/${id}`,
    BY_HOTEL: (hotelId) => `/hotels/${hotelId}/rooms`,
    CHECK_AVAILABILITY: '/rooms/check-availability'
  },
  
  // Bookings
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id) => `/bookings/${id}`,
    MY_BOOKINGS: '/bookings/me',
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`
  },
  
  // Payment
  PAYMENT: {
    CREATE_INTENT: '/payment/create-payment-intent'
  }
};

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
