const cron = require('node-cron');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

/**
 * Starts a cron job to automatically expire pending bookings after 30 minutes
 * The job runs every 5 minutes to check for expired bookings
 * 
 * Process:
 * 1. Finds all pending bookings where expiresAt <= current time
 * 2. Updates booking status to 'expired'
 * 3. Removes booking from room's bookedDates array to free up availability
 * 
 * @function startBookingExpirationJob
 * @returns {void}
 * 
 * @example
 * // Start the expiration job when server starts
 * startBookingExpirationJob();
 */
const startBookingExpirationJob = () => {
  // Run every 5 minutes: */5 * * * *
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      
      // Find all pending bookings that have expired
      const expiredBookings = await Booking.find({
        status: 'pending',
        expiresAt: { $lte: now }
      });

      if (expiredBookings.length === 0) {
        return;
      }

      console.log(`[Expiration Job] Found ${expiredBookings.length} expired bookings`);

      // Update each expired booking
      for (const booking of expiredBookings) {
        // Update booking status to expired
        booking.status = 'expired';
        await booking.save();

        // Remove the booking from room's bookedDates
        await Room.findByIdAndUpdate(
          booking.roomId,
          {
            $pull: {
              bookedDates: { bookingId: booking._id }
            }
          }
        );

        console.log(`[Expiration Job] Expired booking ${booking._id}`);
      }

      console.log(`[Expiration Job] Successfully expired ${expiredBookings.length} bookings`);
    } catch (error) {
      console.error('[Expiration Job] Error:', error.message);
    }
  });

  console.log('[Expiration Job] Booking expiration cron job started (runs every 5 minutes)');
};

module.exports = { startBookingExpirationJob };
