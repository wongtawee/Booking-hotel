import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById } from '../../services/hotelService';
import { getRoomsByHotel } from '../../services/roomService';
import Slider from 'react-slick';
import styles from "./HotelDetails.module.css";

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch hotel details
                const hotelResponse = await getHotelById(id);
                setHotel(hotelResponse.data);
                
                // Fetch available rooms
                const roomsResponse = await getRoomsByHotel(id);
                setRooms(roomsResponse.data);
            } catch (err) {
                setError(err.message || 'Failed to load hotel details');
            } finally {
                setLoading(false);
            }
        };

        fetchHotelData();
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>กำลังโหลด...</h2>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>ไม่พบโรงแรม</h2>
                <p>{error}</p>
            </div>
        );
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: true,
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pauseOnHover: true,
        arrows: true,
    };

 
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles.mainContent}>
          {/* สไลเดอร์รูปภาพ */}
          <div className={styles.sliderSection}>
            <Slider {...settings}>
              {hotel.images && hotel.images.length > 0 ? (
                hotel.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`${hotel.name} ${index}`}
                      className={styles.image}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x400?text=Hotel+Image';
                      }}
                    />
                  </div>
                ))
              ) : (
                <div>
                  <img
                    src="https://via.placeholder.com/800x400?text=No+Image"
                    alt={hotel.name}
                    className={styles.image}
                  />
                </div>
              )}
            </Slider>
          </div>

          {/* รายละเอียดโรงแรม */}
          <div className={styles.details}>
            <h1 className={styles.title}>
              {hotel.name}
              <span className={styles.ratingBadge}>⭐ {hotel.rating}</span>
            </h1>
            <p className={styles.location}>{hotel.location}</p>
            <hr className={styles.divider} />
            <p className={styles.description}>{hotel.description}</p>
            {/* Available Rooms */}
            <div className={styles.roomsSection}>
              <h3 className={styles.subTitle}>🛏️ ห้องพักที่มี</h3>
              {rooms.length > 0 ? (
                <div className={styles.roomsList}>
                  {rooms.map((room) => (
                    <div 
                      key={room._id} 
                      className={`${styles.roomCard} ${selectedRoom?._id === room._id ? styles.selected : ''}`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <h4>{room.roomType}</h4>
                      <p><strong>💰 ราคา:</strong> {room.pricePerNight?.toLocaleString() || 'N/A'} บาท / คืน</p>
                      <p><strong>👥 จำนวนผู้เข้าพัก:</strong> {room.capacity} คน</p>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className={styles.roomAmenitiesContainer}>
                          <button
                            type="button"
                            className={styles.amenitiesToggle}
                            onClick={(e) => {
                              e.stopPropagation();
                              const content = e.currentTarget.nextElementSibling;
                              const isExpanded = content.style.maxHeight;
                              content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
                              e.currentTarget.querySelector('.arrow').style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
                            }}
                          >
                            <strong>สิ่งอำนวยความสะดวกในห้อง ({room.amenities.length})</strong>
                            <span className="arrow" style={{ transition: 'transform 0.3s ease' }}>▼</span>
                          </button>
                          <div className={styles.roomAmenitiesCollapsible}>
                            <div className={styles.roomAmenitiesGrid}>
                              {room.amenities.map((amenity, idx) => (
                                <span key={idx} className={styles.roomAmenityTag}>
                                  <span className={styles.checkIconSmall}>✓</span>
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedRoom?._id === room._id && (
                        <div style={{
                          marginTop: 12,
                          padding: 8,
                          background: 'rgba(102, 126, 234, 0.1)',
                          borderRadius: 8,
                          textAlign: 'center',
                          color: '#667eea',
                          fontWeight: 600
                        }}>
                          ✓ เลือกห้องนี้แล้ว
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noRooms}>
                  <p>😔 ขออภัย ไม่มีห้องพักว่างในขณะนี้</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (selectedRoom) {
                  navigate(`/booking/${hotel._id}?roomId=${selectedRoom._id}`);
                } else {
                  alert('กรุณาเลือกห้องพักก่อนทำการจอง');
                }
              }}
              className={styles.button}
              disabled={!selectedRoom}
            >
              {selectedRoom ? `จองห้อง ${selectedRoom.roomType} →` : '⚠️ กรุณาเลือกห้องพักก่อน'}
            </button>

            {/* สิ่งอำนวยความสะดวกของโรงแรม */}
            <div className={styles.amenitiesSection}>
              <h3 className={styles.subTitle}>🏨 สิ่งอำนวยความสะดวกของโรงแรม</h3>
              <div className={styles.amenitiesGrid}>
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  hotel.amenities.map((item, i) => (
                    <div key={i} className={styles.amenityCard}>
                      <span className={styles.checkIcon}>✓</span>
                      <span className={styles.amenityText}>{item}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.noData}>ไม่มีข้อมูล</p>
                )}
              </div>
            </div>

            {/* แผนที่ */}
            <div className={styles.mapSection}>
              <h2 className={styles.subTitle}>📍 แผนที่ที่ตั้ง</h2>
              <iframe
                title="Google Map"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                  hotel.name + ' ' + hotel.location
                )}&zoom=15`}
                className={styles.map}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default HotelDetails;
