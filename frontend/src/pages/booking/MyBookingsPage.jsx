import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMyBookings } from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './MyBookingsPage.module.css';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // แสดง success message ถ้ามี
    if (location.state?.paymentSuccess) {
      setSuccessMessage(location.state.message);
      // ลบ state เพื่อไม่ให้แสดงซ้ำเมื่อ refresh
      window.history.replaceState({}, document.title);
      
      // ซ่อน message หลัง 5 วินาที
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [location]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getMyBookings();
        setBookings(response.data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูลการจองได้');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: '#fef3c7', color: '#92400e', text: '⏳ รอชำระเงิน', icon: '⏳' },
      paid: { bg: '#d1fae5', color: '#065f46', text: '✅ ชำระแล้ว', icon: '✅' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', text: '❌ ยกเลิกแล้ว', icon: '❌' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '700',
        display: 'inline-block'
      }}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <LoadingSpinner message="กำลังโหลดการจองของคุณ..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>⚠️ เกิดข้อผิดพลาด</h2>
            <p>{error}</p>
            <button 
              className={styles.browseButton}
              onClick={() => window.location.reload()}
              style={{ marginTop: '20px' }}
            >
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>📅 การจองของฉัน</h1>

        {/* Success Message */}
        {successMessage && (
          <div className={styles.successAlert}>
            <span className={styles.successIcon}>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <div className={styles.emptyIcon}>🏨</div>
              <div className={styles.emptyIconBg}></div>
            </div>
            <h2 className={styles.emptyTitle}>ยังไม่มีการจองใดๆ</h2>
            <p className={styles.emptyText}>
              คุณยังไม่มีประวัติการจองโรงแรม<br/>
              เริ่มต้นวางแผนการเดินทางของคุณและสำรวจโรงแรมที่น่าสนใจกันเลย!
            </p>
            <div className={styles.emptyFeatures}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✨</span>
                <span className={styles.featureText}>โรงแรมหลากหลาย</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>💰</span>
                <span className={styles.featureText}>ราคาดีที่สุด</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🎯</span>
                <span className={styles.featureText}>จองง่าย รวดเร็ว</span>
              </div>
            </div>
            <button 
              className={styles.browseButton}
              onClick={() => navigate('/')}
            >
              🔍 เริ่มค้นหาโรงแรม
            </button>
          </div>
        ) : (
          <div className={styles.bookingsList}>
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className={styles.bookingCard}
              >
                <div className={styles.bookingImage}>
                  <img 
                    src={booking.hotelId?.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={booking.hotelId?.name || 'Hotel'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Hotel+Image';
                    }}
                  />
                </div>
                
                <div className={styles.bookingContent}>
                  <div className={styles.bookingHeader}>
                    <h3 className={styles.hotelName}>
                      {booking.hotelId?.name || 'โรงแรม'}
                    </h3>
                    {getStatusBadge(booking.status)}
                  </div>

                  <p className={styles.location}>
                    📍 {booking.hotelId?.location || 'ไม่ระบุสถานที่'}
                  </p>

                  {booking.roomId && (
                    <p className={styles.roomType}>
                      🛏️ ห้อง: {booking.roomId.roomType}
                    </p>
                  )}

                  <div className={styles.bookingInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>เช็คอิน:</span>
                      <span className={styles.infoValue}>
                        {new Date(booking.checkIn).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>เช็คเอาท์:</span>
                      <span className={styles.infoValue}>
                        {new Date(booking.checkOut).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ผู้เข้าพัก:</span>
                      <span className={styles.infoValue}>
                        {booking.guests} คน
                      </span>
                    </div>
                  </div>

                  <div className={styles.bookingFooter}>
                    <div className={styles.totalPrice}>
                      <span className={styles.totalLabel}>ราคารวม:</span>
                      <span className={styles.totalAmount}>
                        ฿{booking.totalPrice?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      {booking.status === 'pending' ? (
                        <button 
                          className={styles.payButton}
                          onClick={() => {
                            navigate('/payment', {
                              state: {
                                bookingId: booking._id,
                                amount: booking.totalPrice,
                                hotelName: booking.hotelId?.name,
                                hotelImage: booking.hotelId?.images?.[0],
                                roomType: booking.roomId?.roomType,
                                checkIn: booking.checkIn,
                                checkOut: booking.checkOut,
                                guests: booking.guests,
                                nights: Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)),
                                pricePerNight: booking.roomId?.pricePerNight
                              }
                            });
                          }}
                        >
                          💳 ชำระเงิน
                        </button>
                      ) : null}
                      <button 
                        className={styles.viewButton}
                        onClick={() => navigate(`/bookings/${booking._id}`)}
                      >
                        ดูรายละเอียด →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
