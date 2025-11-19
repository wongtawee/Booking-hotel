import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentPage.module.css';

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
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight
  } = location.state || {};

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!amount || !bookingId) return;

    const fetchClientSecret = async () => {
      try {
        const amountInCents = Math.round(amount * 100);
        const res = await fetch('/api/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ amount: amountInCents, bookingId })
        });

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ Stripe');
      }
    };

    fetchClientSecret();
  }, [amount, bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(`❌ ชำระเงินล้มเหลว: ${result.error.message}`);
      setLoading(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('✅ ชำระเงินสำเร็จ');
        navigate('/home');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {hotelImage && (
          <img src={hotelImage} alt={hotelName} className={styles.image} />
        )}

        <h2 className={styles.title}>ยืนยันการชำระเงิน</h2>

        <div className={styles.summary}>
          <h3>📋 รายละเอียดการจอง</h3>
          <p><strong>โรงแรม:</strong> {hotelName}</p>
          <p><strong>วันที่เช็คอิน:</strong> {checkIn}</p>
          <p><strong>วันที่เช็คเอาท์:</strong> {checkOut}</p>
          <p><strong>จำนวนคืน:</strong> {nights} คืน</p>
          <p><strong>จำนวนผู้เข้าพัก:</strong> {guests} คน</p>
          <p><strong>ราคาต่อคืน:</strong> {pricePerNight?.toLocaleString()} บาท</p>
          <p className={styles.total}>💰 รวมทั้งหมด: {amount?.toLocaleString()} บาท</p>
        </div>

        <form onSubmit={handleSubmit}>
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#333' } } }} />
          <button
            type="submit"
            disabled={!stripe || !clientSecret || loading}
            className={styles.button}
          >
            {loading ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
          </button>
        </form>

        <p className={styles.note}>
          🔒 ระบบชำระเงินปลอดภัยด้วย Stripe
        </p>
        <img
          src="https://www.openbanking.org.uk/wp-content/uploads/Stripe_Logo_revised_2016.png"
          alt="Stripe Logo"
          className={styles.stripeLogo}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
