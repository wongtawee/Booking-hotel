import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, cancelBooking } from '../../services/bookingService';
import CancelBookingModal from '../../components/booking/CancelBookingModal';
import styles from "./BookingDetail.module.css";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        className: styles.statusPending, 
        text: '⏳ รอชำระเงิน',
        icon: '⏳'
      },
      paid: { 
        className: styles.statusPaid, 
        text: '✓ ชำระแล้ว',
        icon: '✓'
      },
      cancelled: { 
        className: styles.statusCancelled, 
        text: '✕ ยกเลิกแล้ว',
        icon: '✕'
      }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <div className={`${styles.statusBadge} ${config.className}`}>
        <span className={styles.statusIcon}>{config.icon}</span>
        <span className={styles.statusText}>{config.text}</span>
      </div>
    );
  };

  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return nights;
  };

useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookingById(id);
        const bookingData = response.data;
        setBooking(bookingData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'ไม่สามารถโหลดข้อมูลการจอง');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async (reason) => {
    try {
      const response = await cancelBooking(id, { reason });
      setBooking(response.data);
      setShowCancelModal(false);
      
      // แสดง success message
      const successDiv = document.createElement('div');
      successDiv.className = styles.successToast;
      successDiv.innerHTML = '✅ ยกเลิกการจองเรียบร้อยแล้ว';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.remove();
      }, 3000);
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
        hotelImage: booking.hotelId?.images?.[0],
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
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>กำลังโหลดข้อมูลการจอง...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>เกิดข้อผิดพลาด</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/bookings')} className={styles.btnBack}>
          กลับไปหน้าการจอง
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>📭</div>
        <h2>ไม่พบข้อมูลการจอง</h2>
        <button onClick={() => navigate('/bookings')} className={styles.btnBack}>
          กลับไปหน้าการจอง
        </button>
      </div>
    );
  }

  const hotelImage = booking.hotelId?.images?.[0] || 'https://via.placeholder.com/800x400?text=Hotel+Image';
  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/bookings')} className={styles.backButton}>
          ← กลับ
        </button>
        <h1 className={styles.pageTitle}>รายละเอียดการจอง</h1>
      </div>

      {/* Hotel Image */}
      <div className={styles.imageContainer}>
        <img
          src={hotelImage}
          alt={booking.hotelId?.name || 'โรงแรม'}
          className={styles.hotelImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
          }}
        />
      </div>

      {/* Status Badge */}
      <div className={styles.statusContainer}>
        {getStatusBadge(booking.status)}
      </div>

      {/* Hotel Information Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>🏨 ข้อมูลโรงแรม</h2>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.infoRow}>
            <span className={styles.label}>ชื่อโรงแรม:</span>
            <span className={styles.value}>{booking.hotelId?.name || 'ไม่พบข้อมูล'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>สถานที่:</span>
            <span className={styles.value}>{booking.hotelId?.location || 'ไม่พบข้อมูล'}</span>
          </div>
          {booking.hotelId?.rating && (
            <div className={styles.infoRow}>
              <span className={styles.label}>คะแนน:</span>
              <span className={styles.value}>⭐ {booking.hotelId.rating}/5</span>
            </div>
          )}
          {booking.roomId && (
            <div className={styles.infoRow}>
              <span className={styles.label}>ประเภทห้อง:</span>
              <span className={styles.value}>{booking.roomId.roomType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>📅 รายละเอียดการจอง</h2>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.infoRow}>
            <span className={styles.label}>ชื่อผู้จอง:</span>
            <span className={styles.value}>{booking.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>อีเมล:</span>
            <span className={styles.value}>{booking.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>เบอร์โทร:</span>
            <span className={styles.value}>{booking.phone}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>เช็คอิน:</span>
            <span className={styles.value}>
              {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'ไม่พบข้อมูล'}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>เช็คเอาท์:</span>
            <span className={styles.value}>
              {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'ไม่พบข้อมูล'}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>จำนวนคืน:</span>
            <span className={styles.value}>{nights} คืน</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>จำนวนผู้เข้าพัก:</span>
            <span className={styles.value}>{booking.guests} คน</span>
          </div>
        </div>
      </div>

      {/* Payment Information Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>💳 ข้อมูลการชำระเงิน</h2>
        </div>
        <div className={styles.cardBody}>
          {booking.roomId?.pricePerNight && (
            <div className={styles.infoRow}>
              <span className={styles.label}>ราคาต่อคืน:</span>
              <span className={styles.value}>฿{booking.roomId.pricePerNight.toLocaleString()}</span>
            </div>
          )}
          <div className={styles.infoRow}>
            <span className={styles.label}>จำนวนคืน:</span>
            <span className={styles.value}>{nights} คืน</span>
          </div>
          <div className={`${styles.infoRow} ${styles.totalRow}`}>
            <span className={styles.label}>ยอดรวมทั้งหมด:</span>
            <span className={styles.totalValue}>฿{booking.totalPrice?.toLocaleString() || '0'}</span>
          </div>
          {booking.paymentIntentId && (
            <div className={styles.infoRow}>
              <span className={styles.label}>รหัสการชำระเงิน:</span>
              <span className={styles.value}>{booking.paymentIntentId}</span>
            </div>
          )}
          <div className={styles.infoRow}>
            <span className={styles.label}>จองเมื่อ:</span>
            <span className={styles.value}>
              {booking.createdAt ? new Date(booking.createdAt).toLocaleString('th-TH') : 'ไม่พบข้อมูล'}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Payment Warning */}
      {booking.status === 'pending' && (
        <div className={styles.warningCard}>
          <div className={styles.warningIcon}>⚠️</div>
          <div className={styles.warningContent}>
            <h3>กรุณาชำระเงินเพื่อยืนยันการจอง</h3>
            <p>การจองของคุณยังไม่สมบูรณ์ กรุณาชำระเงินเพื่อยืนยันการจอง</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {booking.status === 'pending' && (
          <button onClick={handlePayNow} className={styles.btnPayNow}>
            💳 ชำระเงินเลย
          </button>
        )}
        {booking.status !== 'cancelled' && (
          <button onClick={handleCancelClick} className={styles.btnCancel}>
            ยกเลิกการจอง
          </button>
        )}
      </div>

      {/* Cancel Booking Modal */}
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
