import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getHotelById } from '../services/hotelService';
import { getRoomsByHotel, checkAvailability } from '../services/roomService';
import { createBooking } from '../services/bookingService';
import styles from "./BookingPage.module.css";

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roomIdFromUrl = searchParams.get('roomId');

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(null);

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

    // Fetch hotel and rooms
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const hotelResponse = await getHotelById(id);
                setHotel(hotelResponse.data);

                const roomsResponse = await getRoomsByHotel(id);
                setRooms(roomsResponse.data);

                // Pre-select room if roomId in URL
                if (roomIdFromUrl) {
                    const room = roomsResponse.data.find(r => r._id === roomIdFromUrl);
                    if (room) setSelectedRoom(room);
                }
            } catch (err) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, roomIdFromUrl]);

// Calculate nights and total price
    useEffect(() => {
        const inDate = new Date(form.checkIn);
        const outDate = new Date(form.checkOut);

        if (!isNaN(inDate) && !isNaN(outDate)) {
            const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
            const calculatedNights = diff > 0 ? diff : 0;
            setNights(calculatedNights);

            const price = selectedRoom?.pricePerNight 
                ? selectedRoom.pricePerNight * calculatedNights 
                : 0;
            setTotalPrice(price);
        } else {
            setNights(0);
            setTotalPrice(0);
        }
    }, [form.checkIn, form.checkOut, selectedRoom]);


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

        if (!selectedRoom) {
            alert('กรุณาเลือกห้องพัก');
            return;
        }

        if (nights <= 0) {
            alert('กรุณาเลือกวันที่เช็คอินและเช็คเอาท์');
            return;
        }

        try {
            // Check room availability
            const availabilityResponse = await checkAvailability(
                selectedRoom._id,
                form.checkIn,
                form.checkOut
            );

            if (!availabilityResponse.data.available) {
                alert('ห้องนี้ไม่ว่างในช่วงวันที่เลือก กรุณาเลือกห้องอื่นหรือวันที่อื่น');
                return;
            }

            // Create booking
            const bookingData = {
                ...form,
                hotelId: hotel._id,
                roomId: selectedRoom._id,
                totalPrice,
            };

            const response = await createBooking(bookingData);

            if (response.success) {
                alert('✅ การจองสำเร็จแล้ว!');
                navigate('/payment', {
                    state: {
                        bookingId: response.data._id,
                        amount: response.data.totalPrice,
                        hotelName: hotel.name,
                        hotelImage: hotel.images[0],
                        roomType: selectedRoom.roomType,
                        checkIn: response.data.checkIn,
                        checkOut: response.data.checkOut,
                        guests: response.data.guests,
                        nights,
                        pricePerNight: selectedRoom.pricePerNight,
                    }
                });
            }
        } catch (err) {
            alert(`❌ ${err.message || 'เกิดข้อผิดพลาดในการจอง'}`);
        }
    };


    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}><h2>กำลังโหลด...</h2></div>;
    }

    if (!hotel) {
        return <div style={{ padding: '40px', textAlign: 'center' }}><h2>ไม่พบโรงแรม</h2></div>;
    }

    return (
      <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <h2 className={styles.heading}>จองโรงแรม</h2>
          
          {/* Room Selection */}
          <div className={styles.roomSelection}>
            <label className={styles.label}>เลือกห้องพัก</label>
            <select
              value={selectedRoom?._id || ''}
              onChange={(e) => {
                const room = rooms.find(r => r._id === e.target.value);
                setSelectedRoom(room);
              }}
              className={styles.select}
              required
            >
              <option value="">-- เลือกห้องพัก --</option>
              {rooms.map(room => (
                <option key={room._id} value={room._id}>
                  {room.roomType} - {room.pricePerNight.toLocaleString()} บาท/คืน (จำนวนผู้เข้าพัก: {room.capacity})
                </option>
              ))}
            </select>
          </div>

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
            <button type="submit" className={styles.button} disabled={!selectedRoom}>
              {selectedRoom ? '💳 ดำเนินการชำระเงิน' : '⚠️ กรุณาเลือกห้องพัก'}
            </button>
          </form>
        </div>

        <div className={styles.rightCol}>
          <img src={hotel.images[0]} alt={hotel.name} className={styles.image} />
          <h3 className={styles.hotelName}>{hotel.name}</h3>
          <p className={styles.location}>{hotel.location}</p>

          {selectedRoom && (
            <div className={styles.roomInfo}>
              <h4>ห้องที่เลือก: {selectedRoom.roomType}</h4>
              <p>ราคา: {selectedRoom.pricePerNight.toLocaleString()} บาท/คืน</p>
            </div>
          )}

          {form.checkIn && form.checkOut && selectedRoom && (
            <div className={styles.priceBox}>
              <h4 className={styles.priceTitle}>สรุปค่าบริการ</h4>
              <p><strong>เช็คอิน:</strong> {form.checkIn}</p>
              <p><strong>เช็คเอาท์:</strong> {form.checkOut}</p>
              <p><strong>จำนวนคืน:</strong> {nights} คืน</p>
              <p><strong>ราคาต่อคืน:</strong> {selectedRoom.pricePerNight.toLocaleString()} บาท</p>
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
