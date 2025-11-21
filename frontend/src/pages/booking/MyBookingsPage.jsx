import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageWithLazyLoad from '../../components/common/ImageWithLazyLoad';
import CancelBookingModal from '../../components/booking/CancelBookingModal';
import styles from './MyBookingsPage.module.css';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

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
      pending: { bg: '#fef3c7', color: '#92400e', text: 'รอชำระเงิน', icon: '⏳' },
      paid: { bg: '#d1fae5', color: '#065f46', text: 'ชำระแล้ว', icon: '✅' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', text: 'ยกเลิกแล้ว', icon: '❌' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={styles.statusBadge} style={{
        backgroundColor: config.bg,
        color: config.color
      }}>
        <span className={styles.statusIcon}>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getHotelImage = (booking) => {
    // ตรวจสอบว่ามีรูปภาพหรือไม่
    if (booking.hotelId?.images) {
      if (Array.isArray(booking.hotelId.images) && booking.hotelId.images.length > 0) {
        return booking.hotelId.images[0];
      } else if (typeof booking.hotelId.images === 'string') {
        return booking.hotelId.images;
      }
    }
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  };

  const calculateNights = (checkIn, checkOut) => {
    return Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await cancelBooking(selectedBooking._id);
      setSuccessMessage('ยกเลิกการจองเรียบร้อยแล้ว');
      setCancelModalOpen(false);
      setSelectedBooking(null);
      
      // Refresh bookings
      const response = await getMyBookings();
      setBookings(response.data || []);
      
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err.message || 'ไม่สามารถยกเลิกการจองได้');
    }
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

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
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>📅</span>
              การจองของฉัน
            </h1>
            <p className={styles.subtitle}>
              จัดการและติดตามการจองโรงแรมของคุณ
            </p>
          </div>
          
          {bookings.length > 0 && (
            <div className={styles.filterTabs}>
              <button 
                className={`${styles.filterTab} ${filterStatus === 'all' ? styles.active : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                ทั้งหมด ({bookings.length})
              </button>
              <button 
                className={`${styles.filterTab} ${filterStatus === 'pending' ? styles.active : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                รอชำระ ({bookings.filter(b => b.status === 'pending').length})
              </button>
              <button 
                className={`${styles.filterTab} ${filterStatus === 'paid' ? styles.active : ''}`}
                onClick={() => setFilterStatus('paid')}
              >
                ชำระแล้ว ({bookings.filter(b => b.status === 'paid').length})
              </button>
              <button 
                className={`${styles.filterTab} ${filterStatus === 'cancelled' ? styles.active : ''}`}
                onClick={() => setFilterStatus('cancelled')}
              >
                ยกเลิก ({bookings.filter(b => b.status === 'cancelled').length})
              </button>
            </div>
          )}
        </div>

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
            {filteredBookings.length === 0 ? (
              <div className={styles.noResults}>
                <span className={styles.noResultsIcon}>🔍</span>
                <p>ไม่พบการจองในหมวดนี้</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className={`${styles.bookingCard} ${styles[booking.status]}`}
                >
                  <div className={styles.bookingImage}>
                    <ImageWithLazyLoad
                      src={getHotelImage(booking)}
                      alt={booking.hotelId?.name || 'Hotel'}
                      className={styles.hotelImg}
                    />
                    <div className={styles.imageOverlay}>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  
                  <div className={styles.bookingContent}>
                    <div className={styles.bookingHeader}>
                      <div>
                        <h3 className={styles.hotelName}>
                          {booking.hotelId?.name || 'โรงแรม'}
                        </h3>
                        <p className={styles.location}>
                          <span className={styles.locationIcon}>📍</span>
                          {booking.hotelId?.location || 'ไม่ระบุสถานที่'}
                        </p>
                      </div>
                    </div>

                    {booking.roomId && (
                      <div className={styles.roomInfo}>
                        <span className={styles.roomIcon}>🛏️</span>
                        <span className={styles.roomType}>{booking.roomId.roomType}</span>
                        <span className={styles.roomDivider}>•</span>
                        <span className={styles.roomNights}>
                          {calculateNights(booking.checkIn, booking.checkOut)} คืน
                        </span>
                      </div>
                    )}

                    <div className={styles.bookingInfo}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoIcon}>📅</span>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>เช็คอิน</span>
                          <span className={styles.infoValue}>
                            {new Date(booking.checkIn).toLocaleDateString('th-TH', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.infoDivider}>→</div>
                      
                      <div className={styles.infoItem}>
                        <span className={styles.infoIcon}>📅</span>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>เช็คเอาท์</span>
                          <span className={styles.infoValue}>
                            {new Date(booking.checkOut).toLocaleDateString('th-TH', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.infoItem}>
                        <span className={styles.infoIcon}>👥</span>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>ผู้เข้าพัก</span>
                          <span className={styles.infoValue}>{booking.guests} คน</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.bookingFooter}>
                      <div className={styles.priceSection}>
                        <span className={styles.totalLabel}>ราคารวม</span>
                        <span className={styles.totalAmount}>
                          ฿{booking.totalPrice?.toLocaleString() || '0'}
                        </span>
                      </div>
                      
                      <div className={styles.actionButtons}>
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              className={styles.payButton}
                              onClick={() => {
                                navigate('/payment', {
                                  state: {
                                    bookingId: booking._id,
                                    amount: booking.totalPrice,
                                    hotelName: booking.hotelId?.name,
                                    hotelImage: getHotelImage(booking),
                                    roomType: booking.roomId?.roomType,
                                    checkIn: booking.checkIn,
                                    checkOut: booking.checkOut,
                                    guests: booking.guests,
                                    nights: calculateNights(booking.checkIn, booking.checkOut),
                                    pricePerNight: booking.roomId?.pricePerNight
                                  }
                                });
                              }}
                            >
                              <span className={styles.buttonIcon}>💳</span>
                              ชำระเงิน
                            </button>
                            <button 
                              className={styles.cancelButton}
                              onClick={() => handleCancelBooking(booking)}
                            >
                              <span className={styles.buttonIcon}>✕</span>
                              ยกเลิก
                            </button>
                          </>
                        )}
                        <button 
                          className={styles.viewButton}
                          onClick={() => navigate(`/bookings/${booking._id}`)}
                        >
                          <span className={styles.buttonIcon}>👁️</span>
                          ดูรายละเอียด
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && selectedBooking && (
        <CancelBookingModal
          booking={selectedBooking}
          onConfirm={confirmCancelBooking}
          onCancel={() => {
            setCancelModalOpen(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
