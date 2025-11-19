import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingDetailsRedirect = () => {
  const navigate = useNavigate();

useEffect(() => {
  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bookings/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลการจองได้');

      const data = await res.json();
      console.log('Booking data from API:', data);  // เพิ่มบรรทัดนี้

      if (Array.isArray(data) && data.length > 0) {
        console.log('Navigate to booking id:', data[0].id);  // เช็ค id ตัวแรก
        navigate(`/bookings/${data[0]._id}`, { replace: true });
      } else if (data && data.id) {
        console.log('Navigate to booking id:', data.id); // เช็ค id ที่เป็น object เดี่ยว
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
