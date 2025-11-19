import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockHotels from '../data/mockHotels';
import styles from "./BookingPage.module.css";

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const hotel = mockHotels.find((h) => h.id === id);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
    });

    const [nights, setNights] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

useEffect(() => {
    console.log('Check-in:', form.checkIn);
    console.log('Check-out:', form.checkOut);
    console.log('Hotel:', hotel);

    const inDate = new Date(form.checkIn);
    const outDate = new Date(form.checkOut);

    if (!isNaN(inDate) && !isNaN(outDate)) {
        const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
        const calculatedNights = diff > 0 ? diff : 0;
        setNights(calculatedNights);

        const price = hotel?.price ? hotel.price * calculatedNights : 0;
        setTotalPrice(price);
        console.log('Nights:', calculatedNights);
        console.log('Total Price:', price);
    } else {
        setNights(0);
        setTotalPrice(0);
    }
}, [form.checkIn, form.checkOut, hotel]);


const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === 'phone') {
    // ให้รับเฉพาะตัวเลข และไม่เกิน 10 หลัก
    if (/^\d{0,10}$/.test(value)) {
      setForm({ ...form, [name]: value });
    }
  } else {
    setForm({ ...form, [name]: value });
  }
};


const handleSubmit = async (e) => {
    e.preventDefault();

    if (nights <= 0) {
        alert('กรุณาเลือกวันที่เช็คอินและเช็คเอาท์');
        return;
    }

    const bookingData = {
        ...form,
        hotelId: hotel.id,
        totalPrice,
    };
const token = localStorage.getItem('token');
    try {
        const res = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
            body: JSON.stringify(bookingData),
        });

        const savedBooking = await res.json();

        if (res.ok) {
            alert('✅ การจองสำเร็จแล้ว!');
navigate('/payment', {
  state: {
    bookingId: savedBooking._id,
    amount: savedBooking.totalPrice,
    hotelName: hotel.name,
     hotelImage: hotel.images[0],
    checkIn: savedBooking.checkIn,
    checkOut: savedBooking.checkOut,
    guests: savedBooking.guests,
    nights,
    pricePerNight: hotel.price,
  }
});

        } else {
            alert('❌ เกิดข้อผิดพลาดในการบันทึกการจอง');
        }
    } catch (err) {
        console.error(err);
        alert('❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
};


    if (!hotel) {
        return <div style={styles.centered}><h2>ไม่พบโรงแรม</h2></div>;
    }

    return (
      <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <h2 className={styles.heading}>จองโรงแรม</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="ชื่อ-นามสกุล"
              required
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              required
              value={form.email}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder="เบอร์โทรศัพท์"
              required
              value={form.phone}
              onChange={handleChange}
              className={styles.input}
            />
            <div className={styles.dateRow}>
              <input
                type="date"
                name="checkIn"
                required
                value={form.checkIn}
                onChange={handleChange}
                className={styles.inputHalf}
              />
              <input
                type="date"
                name="checkOut"
                required
                value={form.checkOut}
                onChange={handleChange}
                className={styles.inputHalf}
              />
            </div>
            <input
              type="number"
              name="guests"
              placeholder="จำนวนผู้เข้าพัก"
              min="1"
              max="10"
              required
              value={form.guests}
              onChange={handleChange}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              ดำเนินการชำระเงิน
            </button>
          </form>
        </div>

        <div className={styles.rightCol}>
          <img src={hotel.images[0]} alt={hotel.name} className={styles.image} />
          <h3 className={styles.hotelName}>{hotel.name}</h3>
          <p className={styles.location}>{hotel.location}</p>

          {form.checkIn && form.checkOut && (
            <div className={styles.priceBox}>
              <h4 className={styles.priceTitle}>สรุปค่าบริการ</h4>
              <p><strong>เช็คอิน:</strong> {form.checkIn}</p>
              <p><strong>เช็คเอาท์:</strong> {form.checkOut}</p>
              <p><strong>จำนวนคืน:</strong> {nights} คืน</p>
              <p><strong>ราคาต่อคืน:</strong> {hotel.price.toLocaleString()} บาท</p>
              <hr className={styles.hr} />
              <p className={styles.totalLabel}>รวมทั้งหมด</p>
              <p className={styles.totalPrice}>{totalPrice.toLocaleString()} บาท</p>
            </div>
          )}

          <p className={styles.note}>* ฟรียกเลิกก่อน 24 ชั่วโมง</p>
        </div>
      </div>
    </div>
  );
};


export default BookingPage;
