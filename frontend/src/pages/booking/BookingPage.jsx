import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getHotelById } from '../../services/hotelService';
import { getRoomsByHotel, checkAvailability } from '../../services/roomService';
import { createBooking } from '../../services/bookingService';
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
        guests: 2,
        adults: 2,
        children: 0,
    });

    const [nights, setNights] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [availabilityInfo, setAvailabilityInfo] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

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

// Calculate nights and total price with extra guest charges
    useEffect(() => {
        const inDate = new Date(form.checkIn);
        const outDate = new Date(form.checkOut);

        if (!isNaN(inDate) && !isNaN(outDate) && selectedRoom) {
            const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
            const calculatedNights = diff > 0 ? diff : 0;
            setNights(calculatedNights);

            // Base price
            let price = selectedRoom.pricePerNight * calculatedNights;
            
            // Extra guest charge (only for adults exceeding base capacity of 2)
            // Children are free and don't count towards capacity
            const baseCapacity = 2;
            const extraAdults = Math.max(0, form.adults - baseCapacity);
            const extraGuestCharge = 300; // 300 บาท/คน/คืน
            
            if (extraAdults > 0) {
                price += extraAdults * extraGuestCharge * calculatedNights;
            }
            
            setTotalPrice(price);
        } else {
            setNights(0);
            setTotalPrice(0);
        }
    }, [form.checkIn, form.checkOut, selectedRoom, form.adults]);

    // Check availability when dates or room changes
    useEffect(() => {
        const checkAvailabilityInfo = async () => {
            if (selectedRoom && form.checkIn && form.checkOut && nights > 0) {
                setCheckingAvailability(true);
                try {
                    const response = await checkAvailability(
                        selectedRoom._id,
                        form.checkIn,
                        form.checkOut
                    );
                    setAvailabilityInfo(response.data);
                } catch (err) {
                    console.error('Error checking availability:', err);
                    setAvailabilityInfo(null);
                } finally {
                    setCheckingAvailability(false);
                }
            } else {
                setAvailabilityInfo(null);
            }
        };

        checkAvailabilityInfo();
    }, [selectedRoom, form.checkIn, form.checkOut, nights]);


const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === 'phone') {
    // ให้รับเฉพาะตัวเลข และไม่เกิน 10 หลัก
    if (/^\d{0,10}$/.test(value)) {
      setForm({ ...form, [name]: value });
    }
  } else if (name === 'checkIn') {
    // ถ้าเลือกวันเช็คอิน ให้ตั้งวันเช็คเอาท์เป็นวันถัดไปอัตโนมัติ
    const checkInDate = new Date(value);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const checkOutMin = nextDay.toISOString().split('T')[0];
    
    setForm({ 
      ...form, 
      checkIn: value,
      checkOut: form.checkOut && form.checkOut > value ? form.checkOut : checkOutMin
    });
  } else if (name === 'adults' || name === 'children') {
    const newValue = parseInt(value) || 0;
    const otherValue = name === 'adults' ? form.children : form.adults;
    setForm({ 
      ...form, 
      [name]: newValue,
      guests: newValue + otherValue
    });
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
                const availableRooms = availabilityResponse.data.availableRooms || 0;
                const totalRooms = availabilityResponse.data.totalRooms || 0;
                alert(`❌ ห้องนี้ไม่ว่างในช่วงวันที่เลือก\n\nห้องว่าง: ${availableRooms}/${totalRooms} ห้อง\n\nกรุณาเลือกห้องอื่นหรือวันที่อื่น`);
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
                // Navigate to payment without alert - payment is not complete yet
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
        {/* Hotel Header */}
        <div className={styles.hotelHeader}>
          <div className={styles.headerContent}>
            <div className={styles.hotelImageWrapper}>
              <img 
                src={hotel.images?.[0] || 'https://via.placeholder.com/800x400?text=Hotel+Image'} 
                alt={hotel.name} 
                className={styles.hotelImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>
            <div className={styles.hotelInfo}>
              <h1 className={styles.hotelName}>{hotel.name}</h1>
              <p className={styles.hotelLocation}>📍 {hotel.location}</p>
              {selectedRoom && (
                <div className={styles.selectedRoomBadge}>
                  <span className={styles.badgeIcon}>🛏️</span>
                  <span>{selectedRoom.roomType}</span>
                  <span className={styles.badgeSeparator}>•</span>
                  <span>{selectedRoom.pricePerNight.toLocaleString()} บาท/คืน</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.mainContent}>
            {/* Room Selection */}
            <div className={styles.roomSelection}>
              <h2 className={styles.sectionHeading}>🏨 เลือกห้องพัก</h2>
              <select
                value={selectedRoom?._id || ''}
                onChange={(e) => {
                  const room = rooms.find(r => r._id === e.target.value);
                  setSelectedRoom(room);
                }}
                className={styles.select}
                required
              >
                <option value="">-- เลือกประเภทห้องพัก --</option>
                {rooms.map(room => (
                  <option key={room._id} value={room._id}>
                    {room.roomType} - {room.pricePerNight.toLocaleString()} บาท/คืน (รองรับ {room.capacity} คน)
                  </option>
                ))}
              </select>
            </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* ข้อมูลผู้จอง */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>📝 ข้อมูลผู้จอง</h3>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  name="name"
                  placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>อีเมล</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0812345678"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className={styles.input}
                    maxLength="10"
                  />
                </div>
              </div>
            </div>

            {/* วันที่เข้าพัก */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>📅 วันที่เข้าพัก</h3>
              
              <div className={styles.dateRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>วันเช็คอิน</label>
                  <input
                    type="date"
                    name="checkIn"
                    required
                    value={form.checkIn}
                    onChange={handleChange}
                    min={today}
                    className={styles.inputHalf}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>วันเช็คเอาท์</label>
                  <input
                    type="date"
                    name="checkOut"
                    required
                    value={form.checkOut}
                    onChange={handleChange}
                    min={form.checkIn || tomorrowStr}
                    className={styles.inputHalf}
                  />
                </div>
              </div>

              {nights > 0 && (
                <div className={styles.nightsInfo}>
                  🌙 {nights} คืน
                </div>
              )}
            </div>

            {/* จำนวนผู้เข้าพัก */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>👥 จำนวนผู้เข้าพัก</h3>
              
              <div className={styles.guestRow}>
                <div className={styles.guestItem}>
                  <div className={styles.guestLabel}>
                    <span className={styles.guestIcon}>👨</span>
                    <div>
                      <div className={styles.guestTitle}>ผู้ใหญ่</div>
                      <div className={styles.guestSubtitle}>อายุ 13 ปีขึ้นไป</div>
                    </div>
                  </div>
                  <select
                    name="adults"
                    value={form.adults}
                    onChange={handleChange}
                    className={styles.guestSelect}
                    required
                  >
                    {Array.from({ length: selectedRoom?.capacity || 8 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.guestItem}>
                  <div className={styles.guestLabel}>
                    <span className={styles.guestIcon}>👶</span>
                    <div>
                      <div className={styles.guestTitle}>เด็ก</div>
                      <div className={styles.guestSubtitle}>อายุ 0-12 ปี (ฟรี ไม่นับรวมในความจุห้อง)</div>
                    </div>
                  </div>
                  <select
                    name="children"
                    value={form.children}
                    onChange={handleChange}
                    className={styles.guestSelect}
                  >
                    {Array.from({ length: 4 }, (_, i) => i).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.totalGuests}>
                รวมทั้งหมด: {form.adults} ผู้ใหญ่{form.children > 0 && ` + ${form.children} เด็ก`}
                {selectedRoom && form.adults > selectedRoom.capacity && (
                  <span className={styles.capacityWarning}>
                    ⚠️ จำนวนผู้ใหญ่เกินความจุห้อง ({selectedRoom.capacity} คน)
                  </span>
                )}
              </div>

              {selectedRoom && (
                <div className={styles.capacityInfo}>
                  <div className={styles.capacityLabel}>
                    ความจุห้อง: สูงสุด {selectedRoom.capacity} ผู้ใหญ่ (เด็กไม่นับรวม)
                  </div>
                  {form.adults > 2 && form.adults <= selectedRoom.capacity && (
                    <div className={styles.extraChargeInfo}>
                      💡 มีค่าบริการเพิ่ม 300 บาท/คน/คืน สำหรับผู้ใหญ่เกิน 2 คน
                    </div>
                  )}
                  {form.children > 0 && (
                    <div className={styles.childrenInfo}>
                      👶 เด็ก {form.children} คน - ฟรี ไม่มีค่าใช้จ่ายเพิ่มเติม
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className={styles.button} 
              disabled={!selectedRoom || nights <= 0 || (selectedRoom && form.adults > selectedRoom.capacity)}
            >
              {!selectedRoom 
                ? '⚠️ กรุณาเลือกห้องพัก' 
                : nights <= 0 
                ? '⚠️ กรุณาเลือกวันที่' 
                : selectedRoom && form.adults > selectedRoom.capacity
                ? '⚠️ จำนวนผู้ใหญ่เกินความจุห้อง'
                : '💳 ดำเนินการชำระเงิน'}
            </button>
          </form>
          </div>

          {/* Price Summary Sidebar */}
          <aside className={styles.priceSidebar}>
            <div className={styles.stickyBox}>
              <h3 className={styles.summaryTitle}>💰 สรุปการจอง</h3>
              
              {!selectedRoom ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>กรุณาเลือกห้องพักเพื่อดูรายละเอียดราคา</p>
                </div>
              ) : !form.checkIn || !form.checkOut || nights <= 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>กรุณาเลือกวันที่เพื่อคำนวณราคา</p>
                </div>
              ) : (
                <>
                  {/* Availability Status */}
                  {checkingAvailability ? (
                    <div className={styles.availabilityChecking}>
                      <span className={styles.spinner}>⏳</span>
                      <span>กำลังตรวจสอบห้องว่าง...</span>
                    </div>
                  ) : availabilityInfo ? (
                    <div className={availabilityInfo.available ? styles.availabilityAvailable : styles.availabilityUnavailable}>
                      {availabilityInfo.available ? (
                        <>
                          <span className={styles.availabilityIcon}>✅</span>
                          <div className={styles.availabilityText}>
                            <strong>มีห้องว่าง</strong>
                            <span className={styles.availabilityCount}>
                              เหลือ {availabilityInfo.availableRooms} จาก {availabilityInfo.totalRooms} ห้อง
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className={styles.availabilityIcon}>❌</span>
                          <div className={styles.availabilityText}>
                            <strong>ห้องเต็ม</strong>
                            <span className={styles.availabilityCount}>
                              ห้องว่าง: {availabilityInfo.availableRooms}/{availabilityInfo.totalRooms} ห้อง
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}

                  <div className={styles.divider}></div>

                  <div className={styles.summarySection}>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>📅 เช็คอิน</span>
                      <span className={styles.summaryValue}>{new Date(form.checkIn).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>📅 เช็คเอาท์</span>
                      <span className={styles.summaryValue}>{new Date(form.checkOut).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>🌙 จำนวนคืน</span>
                      <span className={styles.summaryValue}>{nights} คืน</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>👥 ผู้เข้าพัก</span>
                      <span className={styles.summaryValue}>
                        {form.adults} ผู้ใหญ่{form.children > 0 && ` + ${form.children} เด็ก`}
                      </span>
                    </div>
                  </div>

                  <div className={styles.divider}></div>

                  <div className={styles.priceBreakdown}>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>ราคาห้องพัก</span>
                      <span className={styles.priceValue}>{selectedRoom.pricePerNight.toLocaleString()} × {nights}</span>
                    </div>
                    <div className={styles.priceSubtotal}>
                      {(selectedRoom.pricePerNight * nights).toLocaleString()} บาท
                    </div>

                    {form.adults > 2 && (
                      <>
                        <div className={styles.priceRow}>
                          <span className={styles.priceLabel}>ค่าบริการเพิ่ม (ผู้ใหญ่)</span>
                          <span className={styles.priceValue}>{form.adults - 2} คน × 300 × {nights}</span>
                        </div>
                        <div className={styles.priceSubtotal}>
                          {((form.adults - 2) * 300 * nights).toLocaleString()} บาท
                        </div>
                      </>
                    )}

                    {form.children > 0 && (
                      <>
                        <div className={styles.priceRow}>
                          <span className={styles.priceLabel}>เด็ก ({form.children} คน)</span>
                          <span className={styles.priceValue}>ฟรี</span>
                        </div>
                        <div className={styles.priceSubtotal}>
                          0 บาท
                        </div>
                      </>
                    )}
                  </div>

                  <div className={styles.divider}></div>

                  <div className={styles.totalSection}>
                    <span className={styles.totalLabel}>ยอดรวมทั้งหมด</span>
                    <span className={styles.totalPrice}>฿{totalPrice.toLocaleString()}</span>
                  </div>

                  <div className={styles.noteBox}>
                    <p className={styles.note}>✓ ฟรียกเลิกก่อน 24 ชั่วโมง</p>
                    <p className={styles.note}>✓ ไม่มีค่าธรรมเนียมซ่อนเร้น</p>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
  );
};


export default BookingPage;
