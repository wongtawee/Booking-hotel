const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { amount, bookingId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency: 'thb',
      metadata: { bookingId }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้าง PaymentIntent' });
  }
});

module.exports = router;
