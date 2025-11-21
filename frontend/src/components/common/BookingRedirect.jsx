import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/constants';

const BookingDetailsRedirect = () => {
  const navigate = useNavigate();

useEffect(() => {
  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOOKINGS.MY_BOOKINGS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลการจองได้');

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        navigate(`/bookings/${data[0]._id}`, { replace: true });
      } else if (data && data.id) {
        navigate(`/bookings/${data._id}`, { replace: true });
      } else {
        alert('ยังไม่มีข้อมูลการจอง');
        navigate('/bookings', { replace: true });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  fetchBooking();
}, [navigate]);


  return <div>กำลังโหลดข้อมูลการจอง...</div>;
};

export default BookingDetailsRedirect;
