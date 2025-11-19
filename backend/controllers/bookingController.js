const Booking = require('../models/booking');

const createBooking = async (req, res) => {
  try {
    const newBooking = new Booking({
      userId: req.user.id,
      hotelId: req.body.hotelId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: req.body.guests,
      totalPrice: req.body.totalPrice
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถสร้างการจองได้' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจองของคุณ' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'ไม่พบข้อมูลการจอง' });

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงการจองนี้' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'ไม่พบการจอง' });

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'ไม่ได้รับอนุญาต' });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถอัปเดตการจองได้' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'ไม่พบการจอง' });

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'ไม่ได้รับอนุญาต' });
    }

    await booking.deleteOne();
    res.json({ message: 'ลบการจองเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถลบการจองได้' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};
