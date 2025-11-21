import React, { useState } from 'react';
import styles from './CancelBookingModal.module.css';

const CancelBookingModal = ({ isOpen, onClose, onConfirm, booking }) => {
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(reason);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚠️ ยืนยันการยกเลิกการจอง</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Booking Summary */}
          <div className={styles.bookingSummary}>
            <div className={styles.hotelImageWrapper}>
              <img 
                src={booking.hotelId?.images?.[0] || 'https://via.placeholder.com/400x200?text=Hotel'} 
                alt={booking.hotelId?.name}
                className={styles.hotelImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x200?text=Hotel';
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
            onClick={onClose}
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
