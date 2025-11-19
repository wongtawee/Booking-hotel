import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeConfig } from './stripeConfig';

const PaymentForm = ({ amount, bookingId }) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  // ห้ามให้ฟอร์มยืนยันการชำระเงินหาก Stripe ยังไม่โหลด
  if (!stripe || !elements) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.log('[Error]', error);
      alert('เกิดข้อผิดพลาด: ' + error.message);
      setLoading(false);
      return;
    }

    // ส่งข้อมูล paymentMethod ไปยัง Backend เพื่อสร้าง PaymentIntent
    const res = await fetch('http://localhost:5000/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        paymentMethodId: paymentMethod.id,
        bookingId,
      }),
    });

    const { clientSecret } = await res.json();

    // ยืนยันการชำระเงิน
    const confirmPayment = await stripe.confirmCardPayment(clientSecret);

    if (confirmPayment.error) {
      alert('การชำระเงินล้มเหลว: ' + confirmPayment.error.message);
    } else {
      alert('การชำระเงินสำเร็จ!');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>ยอดรวมที่ต้องชำระ: {amount} บาท</h3>
      <CardElement />
      <button type="submit" disabled={loading}>
        {loading ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
      </button>
    </form>
  );
};

const stripePromise = loadStripe(stripeConfig.publishableKey);

const PaymentPage = ({ bookingId, amount }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={amount} bookingId={bookingId} />
    </Elements>
  );
};

export default PaymentPage;
