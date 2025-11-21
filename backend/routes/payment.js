const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const protect = require('../middleware/auth');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', protect, async (req, res) => {
  const { amount, bookingId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency: 'thb',
      metadata: { bookingId }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้าง PaymentIntent' });
  }
});

// Endpoint สำหรับยืนยันการชำระเงินสำเร็จ
router.post('/confirm-payment', protect, async (req, res) => {
  const { bookingId, paymentIntentId } = req.body;

  try {
    console.log('Confirming payment for booking:', bookingId);
    
    // ตรวจสอบ booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error('Booking not found:', bookingId);
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบข้อมูลการจอง' 
      });
    }

    console.log('Found booking:', booking._id, 'Current status:', booking.status);

    // อัพเดท booking status เป็น paid
    booking.status = 'paid';
    booking.paymentIntentId = paymentIntentId;
    await booking.save();

    console.log('Updated booking status to paid');

    // เพิ่มวันที่จองเข้าไปใน room's bookedDates
    await Room.findByIdAndUpdate(booking.roomId, {
      $push: {
        bookedDates: {
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          bookingId: booking._id
        }
      }
    });

    console.log('Added booking dates to room');

    res.json({ 
      success: true, 
      message: 'ชำระเงินสำเร็จ',
      booking 
    });
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการยืนยันการชำระเงิน',
      error: err.message 
    });
  }
});

module.exports = router;
