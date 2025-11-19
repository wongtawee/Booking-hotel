import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockHotels from '../data/mockHotels';
import styles from "./BookingDetail.module.css";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    totalPrice: ''
  });

useEffect(() => {
  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bookings/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'ไม่สามารถโหลดข้อมูลการจอง');
      }

      const bookings = await res.json();
      const bookingData = bookings.find(b => b._id && b._id.toString() === id.toString());



      if (!bookingData) throw new Error('ไม่พบข้อมูลการจองนี้');

      const hotel = mockHotels.find(hotel => hotel.id === bookingData.hotelId);

      setBooking({ ...bookingData, hotel });
      setFormData({
        name: bookingData.name || '',
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        checkIn: bookingData.checkIn ? bookingData.checkIn.substring(0,10) : '',
        checkOut: bookingData.checkOut ? bookingData.checkOut.substring(0,10) : '',
        guests: bookingData.guests || '',
        totalPrice: bookingData.totalPrice || ''
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchBooking();
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'ไม่สามารถอัปเดตการจองได้');
      }

      const updatedBooking = await res.json();
      const hotel = mockHotels.find(hotel => hotel.id === updatedBooking.hotelId);

      setBooking({ ...updatedBooking, hotel });
      setEditMode(false);
      alert('อัปเดตข้อมูลการจองเรียบร้อยแล้ว');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('คุณแน่ใจจะลบการจองนี้หรือไม่?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'ลบการจองไม่สำเร็จ');
      }

      alert('ลบการจองเรียบร้อยแล้ว');
      navigate('/bookings');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>กำลังโหลดข้อมูลการจอง...</div>;
  if (error) return <div style={{ padding: 40, color: 'red', textAlign: 'center' }}>⚠️ {error}</div>;
  if (!booking) return <div style={{ padding: 40, textAlign: 'center' }}>ไม่พบข้อมูลการจอง</div>;

  return (
    <div className={styles.container}>
      <div className={styles.bookingCard}>
        <h2 className={styles.title}>รายละเอียดการจอง</h2>

        <div className={styles.hotelInfo}>
          <img
            src={booking.hotel?.images?.[0] ?? "/default-image.jpg"}
            alt={booking.hotel?.name ?? "โรงแรม"}
            className={styles.hotelImage}
          />

          <div className={styles.hotelDetails}>
            <p>
              <strong>ชื่อโรงแรม:</strong> {booking.hotel ? booking.hotel.name : "ไม่พบข้อมูลโรงแรม"}
            </p>
            <p>
              <strong>สถานที่ตั้ง:</strong> {booking.hotel?.location ?? "ไม่พบข้อมูลสถานที่"}
            </p>
          </div>
        </div>

        {editMode ? (
          <div className={styles.bookingDetails}>
            <label>
              ชื่อ:
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
              อีเมล:
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <label>
              เบอร์โทร:
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </label>
            <label>
              เช็คอิน:
              <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} />
            </label>
            <label>
              เช็คเอาท์:
              <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} />
            </label>
            <label>
              จำนวนผู้เข้าพัก:
              <input type="number" name="guests" value={formData.guests} onChange={handleChange} />
            </label>
            <label>
              รวมทั้งหมด (บาท):
              <input type="number" name="totalPrice" value={formData.totalPrice} onChange={handleChange} />
            </label>

            <div className={styles.buttonGroup}>
              <button onClick={handleUpdate} className={styles.btnSave}>
                บันทึก
              </button>
              <button onClick={() => setEditMode(false)} className={styles.btnCancel}>
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.bookingDetails}>
            <p>
              <strong>ชื่อ:</strong> {booking.name}
            </p>
            <p>
              <strong>อีเมล:</strong> {booking.email}
            </p>
            <p>
              <strong>เบอร์โทร:</strong> {booking.phone}
            </p>
            <p>
              <strong>เช็คอิน:</strong>{" "}
              {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "ไม่พบข้อมูล"}
            </p>
            <p>
              <strong>เช็คเอาท์:</strong>{" "}
              {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "ไม่พบข้อมูล"}
            </p>
            <p>
              <strong>จำนวนผู้เข้าพัก:</strong> {booking.guests ?? "ไม่พบข้อมูล"}
            </p>
            <p>
              <strong>รวมทั้งหมด:</strong>{" "}
              {booking.totalPrice !== undefined && booking.totalPrice !== null
                ? booking.totalPrice.toLocaleString()
                : "ไม่พบข้อมูล"}{" "}
              บาท
            </p>
            <p>
              <i>จองเมื่อ: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "ไม่พบข้อมูล"}</i>
            </p>

            <button onClick={() => setEditMode(true)} className={styles.btnEdit}>
              แก้ไข
            </button>
            <button onClick={handleDelete} className={styles.btnDelete}>
              ลบการจอง
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



export default BookingDetail;
