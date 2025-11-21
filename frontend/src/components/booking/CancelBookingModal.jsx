import React, { useState } from 'react';
import styles from './CancelBookingModal.module.css';

const CancelBookingModal = ({ booking, onConfirm, onCancel, isOpen, onClose }) => {
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Support both prop styles
  const isModalOpen = isOpen !== undefined ? isOpen : !!booking;
  const handleClose = onClose || onCancel;

  if (!isModalOpen || !booking) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(reason);
    } finally {
      setIsProcessing(false);
    }
  };

  const getHotelImage = () => {
    if (booking.hotelId?.images) {
      if (Array.isArray(booking.hotelId.images) && booking.hotelId.images.length > 0) {
        return booking.hotelId.images[0];
      } else if (typeof booking.hotelId.images === 'string') {
        return booking.hotelId.images;
      }
    }
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚠️ ยืนยันการยกเลิกการจอง</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Booking Summary */}
          <div className={styles.bookingSummary}>
            <div className={styles.hotelImageWrapper}>
              <img 
                src={getHotelImage()} 
                alt={booking.hotelId?.name}
                className={styles.hotelImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
                }}
              />
            </div>
            <div className={styles.summaryDetails}>
              <h3 className={styles.hotelName}>{booking.hotelId?.name}</h3>
              <div className={styles.summaryItem}>
                <span className={styles.icon}>📍</span>
                <span className={styles.value}>{booking.hotelId?.location}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.icon}>📅</span>
                <span className={styles.value}>
                  {new Date(booking.checkIn).toLocaleDateString('th-TH', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                  {' - '}
                  {new Date(booking.checkOut).toLocaleDateString('th-TH', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.icon}>👥</span>
                <span className={styles.value}>{booking.guests} คน</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.icon}>💰</span>
                <span className={styles.value}>฿{booking.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div className={styles.reasonSection}>
            <label className={styles.reasonLabel}>
              เหตุผลในการยกเลิก (ไม่บังคับ)
            </label>
            <textarea
              className={styles.reasonInput}
              placeholder="ระบุเหตุผล เช่น เปลี่ยนแผนการเดินทาง, พบโรงแรมที่ดีกว่า..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <div className={styles.charCount}>{reason.length}/200</div>
          </div>

          {/* Warning Message */}
          <div className={styles.warningBox}>
            <div className={styles.warningIcon}>⚠️</div>
            <div className={styles.warningText}>
              <strong>คำเตือน:</strong> เมื่อยกเลิกการจองแล้วจะไม่สามารถกู้คืนได้
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.cancelButton} 
            onClick={handleClose}
            disabled={isProcessing}
          >
            ไม่ยกเลิก
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className={styles.spinner}></span>
                กำลังดำเนินการ...
              </>
            ) : (
              'ยืนยันการยกเลิก'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
