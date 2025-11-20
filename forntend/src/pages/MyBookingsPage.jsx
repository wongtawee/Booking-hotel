import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings } from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './MyBookingsPage.module.css';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getMyBookings();
        setBookings(response.data || []);
      } catch (err) {
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
    return <LoadingSpinner message="กำลังโหลดการจองของคุณ..." />;
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>
          <h2>⚠️ เกิดข้อผิดพลาด</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>📅 การจองของฉัน</h1>

        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏨</div>
            <h2 className={styles.emptyTitle}>ยังไม่มีการจอง</h2>
            <p className={styles.emptyText}>
              คุณยังไม่มีประวัติการจองโรงแรม<br/>
              เริ่มต้นวางแผนการเดินทางของคุณกันเลย!
            </p>
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
                onClick={() => navigate(`/bookings/${booking._id}`)}
              >
                <div className={styles.bookingImage}>
                  <img 
                    src={booking.hotelId?.images?.[0] || '/placeholder.jpg'} 
                    alt={booking.hotelId?.name || 'Hotel'}
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
                    <button className={styles.viewButton}>
                      ดูรายละเอียด →
                    </button>
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
