import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import HomePage from './pages/hotel/HomePage.jsx';
import SearchResultsPage from './pages/hotel/SearchResultsPage.jsx';
import HotelDetails from './pages/hotel/HotelDetails.jsx';
import BookingPage from './pages/booking/BookingPage';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Profile from './pages/user/Profile.jsx';
import PaymentPage from './pages/booking/PaymentPage.jsx';
import BookingDetail from './pages/booking/BookingDetail.jsx';
import BookingRedirect from './components/common/BookingRedirect';
import AboutPage from './pages/static/AboutPage.jsx';
import MyBookingsPage from './pages/booking/MyBookingsPage.jsx';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RRtwNQtiqs9G959cVTD4c8O4riGprjdoKnXdMQHTbTZchfCYncVXvL55EiiBYWh9AteQqPNleg2tT6QoxopRL8900sCR1GO60');

const ProtectedRoute = ({ element, redirectTo }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to={redirectTo} />;
};

const App = () => {
  const location = useLocation();

  // กำหนด path ที่ไม่ต้องการให้แสดง Navbar
  const noNavbarPaths = ['/login', '/register'];

  // เช็คว่า path ปัจจุบันอยู่ใน noNavbarPaths ไหม
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}  
      <div style={{ paddingTop: showNavbar ? '70px' : '0' }}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="hotel/:id" element={<HotelDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/bookings" 
          element={<ProtectedRoute element={<MyBookingsPage />} redirectTo="/login" />} 
        />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/booking-details" element={<BookingRedirect />} />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute
              redirectTo="/login"
              element={
                <Elements stripe={stripePromise}>
                  <PaymentPage />
                </Elements>
              }
            />
          }
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute element={<Profile />} redirectTo="/login" />} 
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
