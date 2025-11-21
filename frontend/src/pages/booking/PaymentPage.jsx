import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentPage.module.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/constants';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    bookingId,
    amount,
    hotelName,
    hotelImage,
    roomType,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight
  } = location.state || {};

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!amount || !bookingId) {
      setError('ไม่พบข้อมูลการจอง กรุณาลองใหม่อีกครั้ง');
      return;
    }

    const fetchClientSecret = async () => {
      try {
        const amountInCents = Math.round(amount * 100);
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PAYMENT.CREATE_INTENT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ amount: amountInCents, bookingId })
        });

        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError('ไม่สามารถเชื่อมต่อระบบชำระเงินได้');
        }
      } catch (fetchError) {
        console.error('Error fetching client secret:', fetchError);
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Stripe');
      }
    };

    fetchClientSecret();
  }, [amount, bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // อัพเดท booking status เป็น paid
        try {
          const confirmResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PAYMENT.CONFIRM_PAYMENT}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              bookingId: bookingId,
              paymentIntentId: result.paymentIntent.id
            })
          });

          const confirmData = await confirmResponse.json();

          if (confirmData.success) {
            // Navigate to bookings page with success message
            navigate('/bookings', { 
              state: { 
                paymentSuccess: true,
                message: 'ชำระเงินสำเร็จ! การจองของคุณได้รับการยืนยันแล้ว'
              } 
            });
          } else {
            setError('ชำระเงินสำเร็จ แต่ไม่สามารถอัพเดทสถานะการจองได้ กรุณาติดต่อเจ้าหน้าที่');
            setLoading(false);
          }
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError);
          setError('ชำระเงินสำเร็จ แต่เกิดข้อผิดพลาดในการอัพเดทสถานะ กรุณาติดต่อเจ้าหน้าที่');
          setLoading(false);
        }
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'Asia/Bangkok'
    });
  };

  if (error && !clientSecret) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>❌</div>
            <h2 className={styles.errorTitle}>เกิดข้อผิดพลาด</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => navigate('/home')} 
              className={styles.backButton}
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>💳 ชำระเงิน</h1>
          <p className={styles.pageSubtitle}>กรุณากรอกข้อมูลบัตรเครดิตเพื่อยืนยันการจอง</p>
        </div>

        <div className={styles.contentGrid}>
          {/* Booking Summary */}
          <div className={styles.summaryCard}>
            <h2 className={styles.cardTitle}>📋 สรุปการจอง</h2>
            
            {hotelImage && (
              <div className={styles.imageWrapper}>
                <img src={hotelImage} alt={hotelName} className={styles.hotelImage} />
              </div>
            )}

            <div className={styles.summaryContent}>
              <div className={styles.hotelInfo}>
                <h3 className={styles.hotelName}>{hotelName}</h3>
                <p className={styles.roomType}>🛏️ {roomType}</p>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📅</span>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>เช็คอิน</span>
                    <span className={styles.detailValue}>{formatDate(checkIn)}</span>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📅</span>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>เช็คเอาท์</span>
                    <span className={styles.detailValue}>{formatDate(checkOut)}</span>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🌙</span>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>จำนวนคืน</span>
                    <span className={styles.detailValue}>{nights} คืน</span>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>👥</span>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>ผู้เข้าพัก</span>
                    <span className={styles.detailValue}>{guests}</span>
                  </div>
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>ราคาต่อคืน</span>
                  <span className={styles.priceValue}>฿{pricePerNight?.toLocaleString()}</span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>จำนวนคืน</span>
                  <span className={styles.priceValue}>× {nights}</span>
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.totalSection}>
                <span className={styles.totalLabel}>ยอดรวมทั้งหมด</span>
                <span className={styles.totalAmount}>฿{amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className={styles.paymentCard}>
            <h2 className={styles.cardTitle}>💳 ข้อมูลการชำระเงิน</h2>
            
            <form onSubmit={handleSubmit} className={styles.paymentForm}>
              <div className={styles.cardElementWrapper}>
                <label className={styles.cardLabel}>ข้อมูลบัตรเครดิต/เดบิต</label>
                <div className={styles.cardElementContainer}>
                  <CardElement 
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#2d3748',
                          fontFamily: '"Prompt", sans-serif',
                          '::placeholder': {
                            color: '#a0aec0',
                          },
                          padding: '12px',
                        },
                        invalid: {
                          color: '#e53e3e',
                        },
                      },
                    }} 
                  />
                </div>
              </div>

              {error && (
                <div className={styles.errorAlert}>
                  <span className={styles.errorAlertIcon}>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!stripe || !clientSecret || loading}
                className={styles.submitButton}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    <span>กำลังดำเนินการ...</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>ชำระเงิน ฿{amount?.toLocaleString()}</span>
                  </>
                )}
              </button>

              <div className={styles.securityNote}>
                <div className={styles.securityIcon}>🔒</div>
                <div className={styles.securityText}>
                  <strong>การชำระเงินปลอดภัย</strong>
                  <p>ข้อมูลบัตรของคุณได้รับการเข้ารหัสและปกป้องด้วย Stripe</p>
                </div>
              </div>

              <div className={styles.stripeLogoWrapper}>
                <span className={styles.poweredBy}>Powered by</span>
                <img
                  src="https://www.openbanking.org.uk/wp-content/uploads/Stripe_Logo_revised_2016.png"
                  alt="Stripe"
                  className={styles.stripeLogo}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
