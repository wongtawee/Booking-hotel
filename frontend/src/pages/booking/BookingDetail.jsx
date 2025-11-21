import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, cancelBooking } from '../../services/bookingService';
import CancelBookingModal from '../../components/booking/CancelBookingModal';
import ImageWithLazyLoad from '../../components/common/ImageWithLazyLoad';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from "./BookingDetail.module.css";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: '#fbbf24',
        bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        text: 'รอชำระเงิน',
        icon: '⏳',
        textColor: '#92400e'
      },
      paid: { 
        color: '#48bb78',
        bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        text: 'ชำระแล้ว',
        icon: '✅',
        textColor: '#065f46'
      },
      cancelled: { 
        color: '#f56565',
        bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        text: 'ยกเลิกแล้ว',
        icon: '❌',
        textColor: '#991b1b'
      }
    };
    return configs[status] || configs.pending;
  };

  const calculateNights = (checkIn, checkOut) => {
    return Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  };

  const getHotelImage = () => {
    if (booking?.hotelId?.images) {
      if (Array.isArray(booking.hotelId.images) && booking.hotelId.images.length > 0) {
        return booking.hotelId.images[0];
      } else if (typeof booking.hotelId.images === 'string') {
        return booking.hotelId.images;
      }
    }
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200';
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookingById(id);
        setBooking(response.data);
      } catch (err) {
        setError(err.message || 'ไม่สามารถโหลดข้อมูลการจอง');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancelConfirm = async (reason) => {
    try {
      const response = await cancelBooking(id, { reason });
      setBooking(response.data);
      setShowCancelModal(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      alert(err.message || 'ไม่สามารถยกเลิกการจองได้');
    }
  };

  const handlePayNow = () => {
    navigate('/payment', {
      state: {
        bookingId: booking._id,
        amount: booking.totalPrice,
        hotelName: booking.hotelId?.name,
        hotelImage: getHotelImage(),
        roomType: booking.roomId?.roomType,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        nights: calculateNights(booking.checkIn, booking.checkOut),
        pricePerNight: booking.roomId?.pricePerNight
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loadingContainer}>
          <LoadingSpinner message="กำลังโหลดข้อมูลการจอง..." />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>{error ? '⚠️' : '📭'}</div>
          <h2>{error ? 'เกิดข้อผิดพลาด' : 'ไม่พบข้อมูลการจอง'}</h2>
          <p>{error || 'ไม่พบข้อมูลการจองที่คุณต้องการ'}</p>
          <button onClick={() => navigate('/bookings')} className={styles.btnBack}>
            <span className={styles.btnIcon}>←</span>
            กลับไปหน้าการจอง
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className={styles.wrapper}>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className={styles.successToast}>
          <span className={styles.toastIcon}>✅</span>
          <span>ยกเลิกการจองเรียบร้อยแล้ว</span>
        </div>
      )}

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => navigate('/bookings')} className={styles.backButton}>
            <span className={styles.backIcon}>←</span>
            <span>กลับ</span>
          </button>
          <div className={styles.headerTitle}>
            <h1>รายละเอียดการจอง</h1>
            <p>หมายเลขการจอง: {booking._id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* Hero Section with Image and Status */}
        <div className={styles.heroSection}>
          <div className={styles.imageWrapper}>
            <ImageWithLazyLoad
              src={getHotelImage()}
              alt={booking.hotelId?.name || 'Hotel'}
              className={styles.heroImage}
            />
            <div className={styles.imageOverlay}>
              <div className={styles.statusBadge} style={{ background: statusConfig.bg }}>
                <span className={styles.statusIcon}>{statusConfig.icon}</span>
                <span className={styles.statusText} style={{ color: statusConfig.textColor }}>
                  {statusConfig.text}
                </span>
              </div>
            </div>
          </div>

          {/* Hotel Info Card */}
          <div className={styles.hotelInfoCard}>
            <h2 className={styles.hotelName}>{booking.hotelId?.name || 'โรงแรม'}</h2>
            <div className={styles.hotelMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>📍</span>
                <span>{booking.hotelId?.location || 'ไม่ระบุสถานที่'}</span>
              </div>
              {booking.hotelId?.rating && (
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>⭐</span>
                  <span>{booking.hotelId.rating}/5</span>
                </div>
              )}
              {booking.roomId && (
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>🛏️</span>
                  <span>{booking.roomId.roomType}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Booking Details */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>📅</span>
                <h3>รายละเอียดการเข้าพัก</h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.dateGrid}>
                  <div className={styles.dateBox}>
                    <span className={styles.dateLabel}>เช็คอิน</span>
                    <span className={styles.dateValue}>
                      {new Date(booking.checkIn).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={styles.dateTime}>14:00 น.</span>
                  </div>
                  <div className={styles.dateDivider}>
                    <span className={styles.nightsBadge}>{nights} คืน</span>
                    <div className={styles.arrow}>→</div>
                  </div>
                  <div className={styles.dateBox}>
                    <span className={styles.dateLabel}>เช็คเอาท์</span>
                    <span className={styles.dateValue}>
                      {new Date(booking.checkOut).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={styles.dateTime}>12:00 น.</span>
                  </div>
                </div>

                <div className={styles.guestInfo}>
                  <span className={styles.guestIcon}>👥</span>
                  <span className={styles.guestText}>{booking.guests} ผู้เข้าพัก</span>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>👤</span>
                <h3>ข้อมูลผู้จอง</h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>👤</span>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>ชื่อผู้จอง</span>
                      <span className={styles.infoValue}>{booking.name}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📧</span>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>อีเมล</span>
                      <span className={styles.infoValue}>{booking.email}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📱</span>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>เบอร์โทร</span>
                      <span className={styles.infoValue}>{booking.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Warning */}
            {booking.status === 'pending' && (
              <div className={styles.warningCard}>
                <div className={styles.warningIcon}>⚠️</div>
                <div className={styles.warningContent}>
                  <h4>กรุณาชำระเงินเพื่อยืนยันการจอง</h4>
                  <p>การจองของคุณยังไม่สมบูรณ์ กรุณาชำระเงินภายใน 24 ชั่วโมง</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment Summary */}
          <div className={styles.rightColumn}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryIcon}>💰</span>
                <h3>สรุปการชำระเงิน</h3>
              </div>
              <div className={styles.summaryBody}>
                <div className={styles.priceRow}>
                  <span>ราคาต่อคืน</span>
                  <span>฿{booking.roomId?.pricePerNight?.toLocaleString() || '0'}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>จำนวนคืน</span>
                  <span>× {nights}</span>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.totalRow}>
                  <span>ยอดรวมทั้งหมด</span>
                  <span className={styles.totalAmount}>
                    ฿{booking.totalPrice?.toLocaleString() || '0'}
                  </span>
                </div>

                {booking.paymentIntentId && (
                  <>
                    <div className={styles.divider}></div>
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentLabel}>รหัสการชำระเงิน</span>
                      <span className={styles.paymentId}>{booking.paymentIntentId}</span>
                    </div>
                  </>
                )}

                <div className={styles.bookingDate}>
                  <span className={styles.bookingDateIcon}>🕐</span>
                  <span className={styles.bookingDateText}>
                    จองเมื่อ {new Date(booking.createdAt).toLocaleString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                {booking.status === 'pending' && (
                  <button onClick={handlePayNow} className={styles.btnPayNow}>
                    <span className={styles.btnIcon}>💳</span>
                    <span>ชำระเงินเลย</span>
                  </button>
                )}
                {booking.status !== 'cancelled' && (
                  <button onClick={() => setShowCancelModal(true)} className={styles.btnCancel}>
                    <span className={styles.btnIcon}>✕</span>
                    <span>ยกเลิกการจอง</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        booking={booking}
      />
    </div>
  );
};

export default BookingDetail;
