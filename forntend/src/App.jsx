import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import HotelDetails from './pages/HotelDetails.jsx';
import BookingPage from './pages/BookingPage';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from './pages/Profile.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import BookingDetail from './pages/BookingDetail.jsx';
import BookingRedirect from './components/BookingRedirect';
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
       <div style={{ paddingTop: showNavbar ? '56px' : '0' }}></div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="hotel/:id" element={<HotelDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
      </Routes>
    </>
  );
};

export default App;
